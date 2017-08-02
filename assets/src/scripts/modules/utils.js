class Utils {
    enterKey() {return 13;}
    escKey() {return 27;}
    apiDomain() {return 'http://sjccoa.internal.mindslapmedia.com';}

    setSessionData(str,v) {
        localStorage.setItem(str,v);
        return;
    }

    getSessionData(str) {
        return localStorage.getItem(str);
    }

    removeSessionData(str) {
        return localStorage.removeItem(str);
    }

    clearSessionData() {
        localStorage.clear();
    }

    getSessionCount() {
        return localStorage.length;
    }

    sendAuthentication(xhr){
        let user = "chris@hacia.net";// your actual username
        let pass = "Password1234!";// your actual password
        let token = user.concat(":", pass);
        let utils = new Utils();
        xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
        xhr.setRequestHeader('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, PATCH');
        xhr.setRequestHeader('Authorization', ("JWT ".concat(utils.getSessionData('sjccoaToken'))));
        //xhr.setRequestHeader('Authorization', ("Basic ".concat(btoa(token))));
    }

    doAjax(methodType, urlString, dataObject, successCB, errorCB, optionalAjaxObjAppendage) {
        let ajaxObj = {
            type: !methodType ? 'GET' : methodType,
            dataType: 'json',
            url: urlString,
            beforeSend: this.sendAuthentication,
            success: (data, textStatus, jqXHR) => {
                if(successCB) {
                    successCB(data, textStatus, jqXHR)
                }
            },
            error: (jqXHR, exception) => {
                if(errorCB) {
                    errorCB(jqXHR, exception)
                }
            }
        }

        if(!!optionalAjaxObjAppendage) {
            this.mergeObjs(ajaxObj, optionalAjaxObjAppendage);
        }


        ajaxObj.data = dataObject;

        $.ajax(ajaxObj);
    }

    doAjaxError(data, cb) {
        let statusMsg=[];
        let expired = false;
        let utils = new Utils();

        data.responseJSON.non_field_errors.map((str) => {
            console.log('Signature has expired.');
            if(str == 'Signature has expired.' || expired === true) {
                expired = true;
                utils.renewSessionToken(cb);
                return;
            }
            statusMsg.push(str);
        });

        if(expired === true) { return; }
        alert(statusMsg.join('\n'));
    }

    mergeObjs(obj1,obj2) {
        let obj3 = {};
        for (let attrname in obj1) { obj3[attrname] = obj1[attrname]; }
        for (let attrname in obj2) { obj3[attrname] = obj2[attrname]; }
        return obj3;
    }

    saySomething(msg) {
        alert(msg);
    }

    monthFull(dateValue) {
        /*
         * Using getMonth() from a date object returns a numeric
         * this is just ment as a means ot getting the human readable version
         * by passing that vaule back which is based off of a 0 indexed array
         */
        let arr = ["January","February","March","April","May","June","July","August","September","October","November","December"];
        return arr[dateValue];
    }

    dayFull(dateValue) {
        /*
         * Using getDay() from a date object returns a numeric
         * this is just ment as a means ot getting the human readable version
         * by passing that vaule back which is based off of a 0 indexed array
         */
        let arr = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
        return arr[dateValue];
    }

    getPosition(arrayName,arrayItem) {
        /*
         * Position of an item in array
         */
        for(let i=0; i<arrayName.length; i++) {
            if(arrayName[i]===arrayItem)
                return i;
        }
    }

    orderByAscending(a, b, prop) {
        /*
         * acending sort
         */
        if (a[prop] === b[prop]) {
            return 0;
        } else if (a[prop] > b[prop]) {
            return 1;
        }
        return -1;
    }

    orderByDescending(a, b, prop) {
        /*
         * Decending sort
         */

        if (a[prop] === b[prop]) {
            return 0;
        } else if (a[prop] > b[prop]) {
            return 1;
        }
        return +1;
    }

    //examples
    // Sort by price high to low
    //arr.sort(sort_by('price', true, parseInt));

    // Sort by city, case-insensitive, A-Z
    //arr.sort(sort_by('city', false, function(a){return a.toUpperCase()}));

    sortBy(field, reverse, primer){
        let key = primer ?
            function(x) {return primer(x[field])} :
            function(x) {return x[field]};

        reverse = !reverse ? 1 : -1;

        return function (a, b) {
            return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
        }
    }

    renewSessionToken(cb) {
        let utils = new Utils();
        let currentToken = utils.getSessionData('sjccoaToken');
        utils.removeSessionData('sjccoaToken');

        utils.doAjax(
            'POST',
            utils.apiDomain() + '/api-token-refresh/',
            {token: currentToken},
            (a, b, c) => {
                utils.setSessionData('sjccoaToken', a.token);
                if(cb) {
                    cb();
                }
            },
            (a, b, c) => {
                utils.doAjaxError(a);
            },
            {}
        );
    }

    findWithAttr(array, attr, value) {
        for(var i = 0; i < array.length; i += 1) {
            if(array[i][attr] === value) {
                return i;
            }
        }
        return -1;
    }
}

export default Utils;
