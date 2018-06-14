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
    const row = await mysql.selectDatabase('owners', 'true');
    ctx.body = { status: 'ok', datas: row };
});

/**
 * [新增业主信息]
 * @type {String}
* 	"ownerInfo": vm.ownerInfo,
    "ownerName": vm.ownerName,
    "ownerCart": vm.ownerCart,
    "ownerTel": vm.ownerTel,
    "update_Tm": upDate
 */
router.post('/', async (ctx, next) => {
    var data = ctx.request.fields;
    await mysql.insertDatas("owners", data);
    ctx.body = { status: 'ok' };
});

/**
 * [根据业主id获取该业主数据]
 * @type {String}
 */
router.get('/:id', async (ctx, next) => {
    const ex = /[0-9]+/;
    var ownerId = Number(ex.exec(ctx.url));
    const row = await mysql.selectDatabase('owners', `ownerID == ${ownerId}`);
    ctx.body = { status: 'ok', datas: row };
});


/**
 * [更新业主信息]
 * @type {String}
 */
router.post('/update', async (ctx, next) => {
    var data = ctx.request.fields;
    const { ownerID} = data;
    const row = await mysql.selectDatabase('owners', `ownerID == ${ownerID}`);
    if (row.length != 0) {
        await mysql.deleteDatas('owners', `ownerID == ${ownerID}`);
        await mysql.insertDatas('owners', data);
        ctx.body = { status: 'ok' };
    } else {
        ctx.body = { status: 'error' };
    }
});

/**
 * [删除业主]
 * @type {String}
 */
router.get('/delete/:id', async (ctx, next) => {
    const ex = /[0-9]+/;
    var id = Number(ex.exec(ctx.url));
    const row = await mysql.selectDatabase('owners', `ownerID == ${id}`);
    if (row.length != 0) {
        await mysql.deleteDatas("owners", `ownerID == ${id}`);
        ctx.body = { status: "ok" };
    } else {
        ctx.body = { status: "error" };
    }
});



export default router;
