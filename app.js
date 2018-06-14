import Koa from 'koa';
import Router from "koa-router";
import co from "co";
import views from 'koa-views';
import path from 'path';
import koaBetterBody from 'koa-better-body';
import crypto from 'crypto';
import session from 'koa-session';
import jwt from 'koa-jwt';
import cors from 'koa2-cors';
import moment from 'moment';

//服务器路由对象
import ProRouter from './router/prorouter'
import Connector from './Connector';

const app = new Koa();
const router = new Router();
//const mysql = new Connector();

app.use(koaBetterBody());
app.use(cors());

app.use(require('koa-static')(path.join(__dirname, '../build')));


var errorHandle = (ctx, next) => {
    return next().catch((err) => {
        if (err.status === 401) {
            ctx.status = 401;
            ctx.body = {
                error: err.originalError ? err.originalError.message : err.message,
            };
        } else {
            throw err;
        }
    });
}


app.use(errorHandle);



app.use(async (ctx, next) => {
    const start = new Date();
    await next();
    const ms = new Date() - start;
    console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});



router.use('/pro_Servers', ProRouter.routes(), ProRouter.allowedMethods());  //用户相关的路由

app.use(router.routes());
app.use(router.allowedMethods());



app.listen(4535, () => {
    console.log('listening to http://localhost:4535');
});

module.exports = app;
