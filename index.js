const Authing = require('authing-js-sdk');

let validAuth = null;

module.exports = function (options) {
    return async function (ctx, next) {
        if (!validAuth) {
            try {
                validAuth = await new Authing({
                    clientId: options.clientId,
                    secret: options.secret
                });
                ctx.request.authing = validAuth;
                try {
                    await next()
                } catch (e) {
                    console.log(e);
                    if(e.message && e.message.code === 2206) {
                        try {
                            validAuth = await new Authing({
                                clientId: options.clientId,
                                secret: options.secret
                            });
                            ctx.request.authing = validAuth;
                            try {
                                await next()
                            } catch(e) {
                                console.log('下游逻辑错误');
                                console.log(e);
                            }
                        } catch (e) {
                            console.log('刷新 validAuth 失败');
                            console.log(e);
                        }
                    }
                }
            } catch (e) {
                validAuth = null;
                console.log('koa-authing 中间件 - clientId 和 secret 验证失败');
                console.log(e)
            }
        } else {
            ctx.request.authing = validAuth;
            await next();
        }
    };
};
