import { Component, ViewChild, ElementRef, OnInit, Input, OnChanges } from '@angular/core';
import { Terminal } from 'xterm';
import * as attach from 'xterm/lib/addons/attach/attach';
import * as fit from 'xterm/lib/addons/fit/fit';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';
import { CtrService } from './ctr.service';
import { CodeExec } from './CodeExec';

@Component({
    selector: 'terminal',
    templateUrl: './terminal.component.html',
    styleUrls: [
        'terminal.component.css'
    ]
})
export class TerminalComponent implements OnInit, OnChanges {
    @Input()
    vmid: string;

    @Input()
    vmname: string;

    @Input()
    endpoint: string;

    public term: any;
    public socket: any;
    constructor(
        public jwtHelper: JwtHelperService,
        public ctrService: CtrService
    ) {

    }

    public paste(code: string) {
        this.term.write(code);
    }

    @ViewChild("terminal") terminalDiv: ElementRef;

    public resize() {
        setTimeout(() => this.term.resize(80, 30), 150);
    }

    ngOnInit() {
        // setup watches
        this.ctrService.getCodeStream().subscribe(
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
    }

    ngOnChanges() {
        if (this.vmid != null && this.endpoint != null) {
            Terminal.applyAddon(attach);
            Terminal.applyAddon(fit);
            this.term = new Terminal();


            this.socket = new WebSocket("wss://" + this.endpoint + "/shell/" + this.vmid + "/connect?auth=" + this.jwtHelper.tokenGetter());

            this.socket.onopen = (e) => {
                this.term.attach(this.socket, true, true);
                this.term.open(this.terminalDiv.nativeElement);

                setInterval(() => {
                    this.socket.send(''); // keepalive
                }, 5000);
            }
        }
    }
}