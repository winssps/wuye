import Router from "koa-router";
import crypto from 'crypto';
import jsonwebtoken from 'jsonwebtoken';

import mysql from '../config2';


const router = new Router();

/**
 * [获取来访信息列表]
 * @type {String}
 */
router.get('/', async (ctx, next) => {
    const row = await mysql.selectDatabase('visit', 'true');
    ctx.body = { status: 'ok', datas: row };
});

/**
 * [添加来访]
 * @type {String}
 */
router.post('/', async (ctx, next) => {
    var data = ctx.request.fields;
    await mysql.insertDatas("visit", data);
    ctx.body = { status: 'ok', message: "更新成功" };
});


/**
 * [根据来访id获取该来访数据]
 * @type {String}
 */
router.get('/:id', async (ctx, next) => {
    const ex = /[0-9]+/;
    var visitId = Number(ex.exec(ctx.url));
    const row = await mysql.selectDatabase('visit', `id == ${visitId}`);
    ctx.body = { status: 'ok', datas: row };
});

/**
 * [添加来访]
 * @type {String}
 */
router.post('/update', async (ctx, next) => {
    var data = ctx.request.fields;
    const { visitName } = data;
    const row = await mysql.selectDatabase('visit', `name == ${visitName}`);
    if (row.length != 0) {
        await mysql.deleteDatas('visit', `name == ${visitName}`);
        await mysql.insertDatas('visit', data);
        ctx.body = { status: 'ok', message: "更新成功" };
    } else {
        ctx.body = { status: 'error', message: "更新失败" };
    }
});


/**
 * [删除]
 * @type {String}
 */
router.delete('/:id', async (ctx, next) => {
    const ex = /[0-9]+/;
    var id = Number(ex.exec(ctx.url));
    const row = await mysql.selectDatabase('visit', `id == ${id}`);
    if (row.length != 0) {
        await mysql.deleteDatas("visit", `id == ${id}`);
        ctx.body = { status: "ok" };
    } else {
        ctx.body = { status: "error" };
    }
});


export default router;
