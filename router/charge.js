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
    ctx.body = { status: 'ok', datas: row };
});

/**
 * [添加缴费]
 * @type {String}
 *  "ownerID": vm.ownerID, //业主id
    "chargeTime": vm.ownerAddress, //业主住址
    "chargeName": vm.chargeName, //损坏描述
    "chargeMoney": vm.chargeMoney, //维修费用
    "update_Tm": upDate //时间
 */
router.post('/', async (ctx, next) => {
    var data = ctx.request.fields;
    console.log(data);
    await mysql.insertDatas("charge", data);
    ctx.body = { status: 'ok', message: "更新成功" };
});


/**
 * [根据报修id获取该缴费数据]
 * @type {String}
 */
router.get('/propid/:id', async (ctx, next) => {
    const ex = /[0-9]+/;
    var chargeId = Number(ex.exec(ctx.url));
    const row = await mysql.selectDatabase('charge', `chargeID == ${chargeId}`);
    ctx.body = { status: 'ok', datas: row };
});

/**
 * [添加缴费]
 * @type {String}
 */
router.post('/update', async (ctx, next) => {
    var data = ctx.request.fields;
    const { ownerID } = data;
    const row = await mysql.selectDatabase('charge', `ownerID == ${ownerID}`);
    if (row.length != 0) {
        await mysql.deleteDatas('charge', `ownerID == ${ownerID}`);
        await mysql.insertDatas('charge', data);
        ctx.body = { status: 'ok', message: "更新成功" };
    } else {
        ctx.body = { status: 'error', message: "更新失败" };
    }
});

/**
 * [删除缴费]
 * @type {String}
 */
router.get('/delete/:id', async (ctx, next) => {
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
