import Router from "koa-router";
import crypto from 'crypto';
import jsonwebtoken from 'jsonwebtoken';

import mysql from '../config2';

const router = new Router();

/**
 * [获取报修列表]
 * @type {String}
 */
router.get('/', async (ctx, next) => {
    const row = await mysql.selectDatabase('repairS', 'true');
    ctx.body = { status: 'ok', repairs: row };
});

/**
 * [添加保修]
 * @type {String}
 */
router.post('/', async (ctx, next) => {
    var data = JSON.parse(ctx.request.body);
    await mysql.insertDatas("repairS", data);
    ctx.body = { status: 'ok' };
});

/**
 * [根据报修id获取该报修数据]
 * @type {String}
 */
router.get('/repId/:id', async (ctx, next) => {
    const ex = /[0-9]+/;
    var ownerId = Number(ex.exec(ctx.url));
    const row = await mysql.selectDatabase('repairS', `ownerID == ${ownerId}`);
    ctx.body = { status: 'ok', repairs: row };
});

/**
 * [添加报修, 更新数据]
 * @type {String}
 */
router.post('/update', async (ctx, next) => {
    var data = JSON.parse(ctx.request.body);
    const { ownerId, repairInfo, repairIdentify, repairTime, update_Tm } = data;
    const row = await mysql.selectDatabase('repairS', `ownerID == ${ownerId}`);
    if (row.length != 0) {
        await mysql.deleteDatas('repairS', `ownerID == ${ownerID}`);
        await mysql.insertDatas('repairS', data);
        ctx.body = { status: 'ok' };
    } else {
        ctx.body = { status: 'error' };
    }
});

/**
 * [删除报修repariIDrepariID]
 * @type {String}
 */
router.get('/delete/:id', async (ctx, next) => {
    const ex = /[0-9]+/;
    var id = Number(ex.exec(ctx.url));
    const row = await mysql.selectDatabase('repairS', `reparilDreparilD == ${id}`);
    if (row.length != 0) {
        await deleteDatas("repairS", `reparilDreparilD == ${id}`);
        ctx.body = { status: "ok" };
    } else {
        ctx.body = { status: "error" };
    }
});



export default router;
