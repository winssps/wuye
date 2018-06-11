import Router from "koa-router";
import crypto from 'crypto';
import jsonwebtoken from 'jsonwebtoken';

import mysql from '../config2';


const router = new Router();

/**
 * [获取缴费列表]
 * @type {String}
 */
router.get('/', async (ctx, next) => {
    const row = await mysql.selectDatabase('charge', 'true');
    ctx.body = { status: 'ok', charges: row };
});

/**
 * [添加缴费]
 * @type {String}
 */
router.post('/', async (ctx, next) => {
    var data = JSON.parse(ctx.request.body);
    await mysql.insertDatas("charge", data);
    ctx.body = { status: 'ok' };
});


/**
 * [根据报修id获取该缴费数据]
 * @type {String}
 */
router.get('/propid/:id', async (ctx, next) => {
    const ex = /[0-9]+/;
    var chargeId = Number(ex.exec(ctx.url));
    const row = await mysql.selectDatabase('charge', `chargeId == ${chargeId}`);
    ctx.body = { status: 'ok', charges: row };
});

/**
 * [添加缴费]
 * @type {String}
 */
router.post('/update', async (ctx, next) => {
    var data = JSON.parse(ctx.request.body);
    const { ownerID, chargeTime, chargeName, chargeMoney, update_Tm } = data;
    const row = await mysql.selectDatabase('charge', `ownerID == ${ownerID}`);
    if (row.length != 0) {
        await mysql.deleteDatas('charge', `ownerID == ${ownerID}`);
        await mysql.insertDatas('charge', data);
        ctx.body = { status: 'ok' };
    } else {
        ctx.body = { status: 'error' };
    }
});

/**
 * [删除报修repariIDrepariID]
 * @type {String}
 */
router.get('/delete', async (ctx, next) => {
    const ex = /[0-9]+/;
    var id = Number(ex.exec(ctx.url));
    const row = await mysql.selectDatabase('charge', `ownerID == ${id}`);
    if (row.length != 0) {
        await mysql.deleteDatas("charge", `ownerID == ${id}`);
        ctx.body = { status: "ok" };
    } else {
        ctx.body = { status: "error" };
    }
});


export default router;
