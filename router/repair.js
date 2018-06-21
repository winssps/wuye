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
    const row = await mysql.selectDatabase('repairs', 'true');
    ctx.body = { status: 'ok', datas: row };
});

/**
 * [添加保修]
 * @type {String}
 */
router.post('/', async (ctx, next) => {
    var data = ctx.request.fields;
    await mysql.insertDatas("repairs", data);
    ctx.body = { status: 'ok' };
});

/**
 * [根据报修id获取该报修数据]
 * @type {String}
 */
router.get('/:id', async (ctx, next) => {
    const ex = /[0-9]+/;
    var repairId = Number(ex.exec(ctx.url));
    const row = await mysql.selectDatabase('repairs', `repairID == ${repairId}`);
    ctx.body = { status: 'ok', datas: row };
});

/**
 * [添加报修, 更新数据]
 * @type {String}
 */
router.post('/update', async (ctx, next) => {
    var data = ctx.request.fields;
    const { ownerID } = data;
    console.log(ownerID);
    const row = await mysql.selectDatabase('repairs', `ownerID == ${ownerID}`);
    if (row.length != 0) {
        await mysql.deleteDatas('repairs', `ownerID == ${ownerID}`);
        await mysql.insertDatas('repairs', data);
        ctx.body = { status: 'ok' };
    } else {
        ctx.body = { status: 'error' };
    }
});

/**
 * [删除报修repariID]
 * @type {String}
 */
router.get('/delete/:id', async (ctx, next) => {
    const ex = /[0-9]+/;
    var id = Number(ex.exec(ctx.url));
    const row = await mysql.selectDatabase('repairs', `repairID == ${id}`);
    if (row.length != 0) {
        await mysql.deleteDatas("repairs", `repairID == ${id}`);
        ctx.body = { status: "ok" };
    } else {
        ctx.body = { status: "error" };
    }
});



export default router;
