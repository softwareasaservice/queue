const preparePacket = function (_event,_this){ 
    var _url = process.env.IMPORT_SAAS_QUEUE_URL_PUSH || `${_this.settings.path}/${_event}`
    var packet = {url:_url, event:_event, opts:_this.opts, settings:_this.settings, quality:_this.quality, length: _this.buff.lenth, data:_this.buff.splice(0,25)}
    return packet
}

export class Queue { 
    constructor(opts, debug){
        opts = opts || {}
        var _this = this
        _this.opts = opts
        _this.debug = debug || {}
        _this.buff = []
        _this.settings = {env: process.env.NODE_ENV, version:1}
        _this.settings.EMAIL = opts.EMAIL ||  'ephemeral'
        _this.settings.APIKEY = opts.APIKEY || `${Date.now()}`
        _this.settings.apiKeyPath = opts.APIKEY ? `${_this.settings.version}/private/${_this.settings.APIKEY}` : `${_this.settings.version}/public/${_this.settings.APIKEY}`
        _this.settings.HOST = opts.HOST ? opts.HOST : `https://api.importsaas.com`
        _this.settings.path = `${_this.settings.HOST}/${_this.settings.env}/${_this.settings.apiKeyPath}/queue`
        _this.settings.created_at = Date.now()
        _this.quality = {max:0, ctr:0}
        _this.settings.maxBuffer = opts.maxBuffer || 25
        _this.settings.intervalInMs = opts.intervalInMs || 5000
        setInterval(_this.clearBuffer, _this.settings.intervalInMs, _this)
        return _this
    }

    async clearBuffer(_this) {
        var cont = _this.buff.length?true:false
        if(!cont){
            return
        }
        _this.quality.ctr++
        if(_this.buff.length > _this.quality.max){ _this.quality.max = _this.buff.length}
        var _event = 'queue.push'
        for(var i=0; i < _this.settings.maxBuffer && _this.buff.length; i++){
            cont = true
            var packet = preparePacket(_event, _this)
            if(_this.debug.debugger){
                _this.debug.debugger({event:_event, items:packet.data})
            }else{
                await fetch(
                    `${packet.url}`, 
                    {
                        body: JSON.stringify(packet),
                        headers: {
                            'Authorization': 'Basic ' + btoa(`${_this.settings.EMAIL}:${_this.settings.APIKEY}`),
                            'Content-Type': 'application/json',
                        },
                        method: 'POST'
                    }).then(() => {
                    if(_this.debug.onSuccess){
                        _this.debug.onSuccess(null, {event:_event, items:packet.data})
                    }
                }).catch((er) => {
                    if(_this.debug.onError){
                        _this.debug.onError(er, {event:_event, items:packet.data})
                    }
                })
            }
        }
    }

    add (x) {
        this.buff.push({uts:Date.now(), item: x})
        return this.buff.length
    }
}