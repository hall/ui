import { Component, ViewChild, ElementRef, OnInit, Input, OnChanges, ViewEncapsulation } from '@angular/core';
import { Terminal } from 'xterm';
import { FitAddon, ITerminalDimensions } from 'xterm-addon-fit';
import { AttachAddon } from 'xterm-addon-attach';
import { JwtHelperService } from '@auth0/angular-jwt';
import { CtrService } from '../ctr/ctr.service';
import { CodeExec } from '../ctr/code-exec';
import { ShellService } from './shell.service';
import { environment } from 'src/environments/environment';
import { HostListener } from '@angular/core';

@Component({
    selector: 'terminal',
    templateUrl: './terminal.component.html',
    styleUrls: [
        'terminal.component.scss'
    ],
    encapsulation: ViewEncapsulation.None,
})
export class TerminalComponent implements OnChanges {
    @Input()
    vmid: string;

    @Input()
    vmname: string;

    @Input()
    endpoint: string;

    public dimensions: ITerminalDimensions;
    public term: any;
    public fitAddon: FitAddon;
    public attachAddon: AttachAddon;
    public socket: WebSocket;
    constructor(
        public jwtHelper: JwtHelperService,
        public ctrService: CtrService,
        public shellService: ShellService
    ) { }

    @HostListener('window:resize', ['$event'])
    onResize(event?) {
        this.dimensions = this.fitAddon.proposeDimensions()
        let height = this.dimensions.rows
        let width = this.dimensions.cols
        this.socket.send(`\u001b[8;${height};${width}t`)
        this.fitAddon.fit()
    }

    public paste(code: string) {
        this.term.write(code);
    }

    @ViewChild("terminal", { static: true }) terminalDiv: ElementRef;

    buildSocket() {
        if (!this.endpoint.startsWith("wss://") && !this.endpoint.startsWith("ws://")) {
            if (environment.server.startsWith("https")) {
              this.endpoint = "wss://" + this.endpoint
            } else {
              this.endpoint = "ws://" + this.endpoint
            }
        }

        this.socket = new WebSocket(this.endpoint + "/shell/" + this.vmid + "/connect?auth=" + this.jwtHelper.tokenGetter());

        this.term = new Terminal({
          theme: {
            background: '#292b2e'
          },
          fontFamily: "monospace",
          fontSize: 16,
          letterSpacing: 1.1
        });
        this.attachAddon = new AttachAddon(this.socket);
        this.fitAddon = new FitAddon();
        this.term.loadAddon(this.fitAddon)
        this.term.open(this.terminalDiv.nativeElement);
        this.fitAddon.fit();

        this.socket.onclose = (e) => {
            this.term.dispose(); // destroy the terminal on the page to avoid bad display
            this.shellService.setStatus(this.vmname, "Disconnected (" + e.code + ")");
            if (!e.wasClean) {
                this.shellService.setStatus(this.vmname, "Reconnecting " + new Date().toLocaleTimeString());
                // we're going to try and rebuild things
                // but only after waiting an appropriate mourning period...
                setTimeout(() => this.buildSocket(), 5000);
            }
        }

        this.socket.onopen = (e) => {
            this.shellService.setStatus(this.vmname, "Connected");
            this.term.loadAddon(this.attachAddon)
            this.term.focus();
            this.onResize();

            this.ctrService.getCodeStream()
                .subscribe(
                    (c: CodeExec) => {
                        if (!c) {
                            return;
                        }
                        // if the code exec is target at us,execute it
                        if (c.target.toLowerCase() == this.vmname.toLowerCase()) {
                            // break up the code by lines
                            var codeArray: string[] = c.code.split("\n");
                            // drop each line
                            codeArray.forEach(
                                (s: string) => {
                                    // this.term.writeln(s)
                                    this.socket.send(s + "\n");
                                }
                            )
                        }
                    }
                )

            setInterval(() => {
                this.socket.send(''); // websocket keepalive
            }, 5000);
        }
    }

    ngOnChanges() {
        if (this.vmid != null && this.endpoint != null) {
            this.buildSocket();
        }
    }
}
