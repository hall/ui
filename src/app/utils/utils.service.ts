import { HttpParams } from '@angular/common/http';
import { formatDate } from '@angular/common';

export class Utils {

  constructor(
  ) { }

  public params(x) {
    let params = new HttpParams();
    for (var key of Object.keys(x)) {

      if (x[key] instanceof Date && x[key] != null && x[key] != "") {
        params = params.set("expiration", formatDate(x[key], "E LLL dd HH:mm:ss UTC yyyy", "en-US", "UTC"))
        continue
      }

      switch (typeof x[key]) {
        case 'string':
          params = params.append(key, x[key]);
          break

        default:
          params = params.append(key, JSON.stringify(x[key]));
      }

    }

    return params;
  }

}
