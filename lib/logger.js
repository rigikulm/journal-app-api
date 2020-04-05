// logger.js - logger for the serverless project

// NOTES
// This could come in handy for logic that shows IP/Host for container,
// and something different for a Lambda.
/**
 * bindings
 * Changes the shape of the bindings. The default shape is { pid, hostname }.
 * The function takes a single argument, the bindings object. It will be called
 * every time a child logger is created.
 * 
 * const formatters = {
 *  bindings (bindings) {
 *   return { pid: bindings.pid, hostname: bindings.hostname }
 *  }
 * }
 */
const opts = {
  name: 'my-logger',
  messageKey: 'message',
  nestedKey: 'other',
  mixin: requestInfo
};

function requestInfo() {
  return {userId: "fred", role: 'Admin'};
}

//exports.logger = require('pino')(opts);
//log = require('pino')(opts);
const pino = require('pino');

const INFO_TYPE = 'info';
const ERROR_TYPE = 'error';

class FaaSLogger {
  constructor(options) {
    this.appName = null;
    this.serviceName = null;
    this.logger = null;
    this.msgType = INFO_TYPE;

    if ( options.hasOwnProperty('appName') ) {
      this.appName = options.appName;
    }

    if ( options.hasOwnProperty('serviceName') ) {
      this.serviceName = options.serviceName;
    }

    const pinoOpt = {
      messageKey: 'message',
      nestedKey: 'other',
      mixin: (name = this.appName, service = this.serviceName) =>  {
        let mixin = {};
        if (name != null) {
          mixin['appName'] = name;
        }

        if (service != null) {
          mixin['serviceName'] = service;
        }

        mixin['type'] = this.msgType;
        return mixin;
      }
    };

    this.logger = pino(pinoOpt);
  }

  info(o, ...n) {
    this.msgType = INFO_TYPE;
    this.logger.info(o, ...n);
  }

  error(o, ...n) {
    this.msgType = ERROR_TYPE;
    this.logger.error(o, ...n);
  }


}

//log.info('This is  test');
//log.info({statusCode: 200, statusDescription: 'This is bad'}, 'This is a second message');

let logger = new FaaSLogger({appName: 'My App', serviceName: 'My Service'});
logger.info('This is test 1');
logger.info({statusCode: 200, statusDescription: 'This is bad'}, 'This is a second message');
//logger.info('This is a third message', {statusCode: 200, statusDescription: 'This is bad'});
//logger.info('This is test four', 'hello', 'world');
logger.error({statusCode: 500, statusDescription: 'This is bad'}, 'Oh craaaaappp....');