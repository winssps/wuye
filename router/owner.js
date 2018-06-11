import Router from "koa-router";
import crypto from 'crypto';
import jsonwebtoken from 'jsonwebtoken';


import mysql from '../config2';

const router = new Router();

/**
 * [获取业主列表]
 * @type {String}
 */
router.get('/', async (ctx, next) => {
    const row = await selectDatabase('Owners', 'true');
    ctx.body = { status: 'ok', owners: row };
});

/**
 * [新增业主信息]
 * @type {String}
 */
router.post('/', async (ctx, next) => {
    var data = JSON.parse(ctx.request.body);
    await mysql.insertDatas("Owners", data);
    ctx.body = { status: 'ok' };
});

/**
 * [根据业主id获取该业主数据]
 * @type {String}
 */
router.get('/ownerID/:id', async (ctx, next) => {
    const ex = /[0-9]+/;
    var ownerId = Number(ex.exec(ctx.url));
    const row = await mysql.selectDatabase('Owners', `ownerID == ${ownerId}`);
    ctx.body = { status: 'ok', owners: row };
});


/**
 * [更新业主信息]
 * @type {String}
 */
router.post('/update', async (ctx, next) => {
    var data = JSON.parse(ctx.request.body);
    const { ownerID, ownerInfo, ownerName, ownerCart, ownerTel, update_Tm } = data;
    const row = await mysql.selectDatabase('Owners', `ownerID == ${ownerID}`);
    if (row.length != 0) {
        await mysql.deleteDatas('Owners', `ownerID == ${ownerID}`);
        await mysql.insertDatas('Owners', data);
        ctx.body = { status: 'ok' };
    } else {
        ctx.body = { status: 'error' };
    }
});

/**
 * [删除业主]
 * @type {String}
 */
router.post('/delete/:id', async (ctx, next) => {
    const ex = /[0-9]+/;
    var id = Number(ex.exec(ctx.url));
    const row = await mysql.selectDatabase('Owners', `ownerID == ${id}`);
    if (row.length != 0) {
        await mysql.deleteDatas("Owners", `ownerID == ${id}`);
        ctx.body = { status: "ok" };
    } else {
        ctx.body = { status: "error" };
    }
});



export default router;
