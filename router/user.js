import Router from "koa-router";
import crypto from 'crypto';
import jsonwebtoken from 'jsonwebtoken';


import mysql from '../config2';


const router = new Router();


/**
 * [获取管理员列表]
 * @type {String}
 */
router.get('/', async (ctx, next) => {
  //  await mysql.updateDatas('Users', 'ID == 100001', 'Name', 'sssdf');
    const row = await mysql.selectDatabase('Users', 'true');
    ctx.body = { status: 'ok', users: row };
});


/**
 * [获取管理员信息,根据id来获取某一个管理员信息]
 * @type {[type]}
 * 
*/
router.get('/:id', async (ctx, next) => {
    var ex = /[0-9]+/;
    var id = Number(ex.exec(ctx.url));
    const row = await mysql.selectDatabase('Users', `ID == ${id}`);
    ctx.body = { status: 'ok', users: row };
})

/**
 * [管理员删除,根据id删除某一个管理员]
 * @type {[type]}
 */
router.delete('/:id', async (ctx, next) => {
    var ex = /[0-9]+/;
    var id = Number(ex.exec(ctx.url));
    const row = await mysql.selectDatabase('Users', `ID == ${id}`);
    console.log(row);
    if (row.length != 0) {
        await mysql.deleteDatas('Users', `ID == ${id}`);
        ctx.body = { status: "ok", message: "删除成功" };
    } else {
        ctx.body = { status: "error", message: "删除失败" };
    }
})

/**
 * [注册]
 * @type {String}
 * @type Name
 * @type Password
 * @type Email
 * @type Phone
 */
router.post('/', async (ctx, next) => {
    var regfrom = JSON.parse(ctx.request.body);
    const { Name } = regfrom;
    const row = await mysql.selectDatabase('Users', `Name == ${Name}`);
    if (row.length != 0) {
        ctx.body = { 'status': 'error' }
    } else {
        await mysql.insertDatas('Users', regfrom);
        ctx.body = { 'status': 'ok' };
    }
});

/**
 * [登录]
 * @type {String}
 * "Name": vm.name,
	"Password": vm.password
 */
router.post('/login', async (ctx, next) => {
    var login = JSON.parse(ctx.request.body);
    const { Name, Password } = login;
    const row = await mysql.selectDatabase('Users', `Name == ${Name}`);
    if (row.length != 0) {
        if (row.Name == Name && row.Password == Password) {
            ctx.body = { status: 'ok' };
        } else {
            ctx.body = { status: 'error' };
        }
    } else {
        ctx.body = { status: 'error' };
    }
});

/**
 * [删除管理员角色]
 * @type {String}
 */
router.get('/userrole/:id', async (ctx, next) => {
    var ex = /[0-9]+/;
    var roleid = Number(ex.exec(ctx.url));
    const row = await mysql.selectDatabase('user_role', `role_id == ${roleid}`);
    if (row.length != 0) {
        await mysql.deleteDatas('user_role', `role_id == ${roleid}`);
        ctx.body = { status: "ok", message: "删除成功" };
    } else {
        ctx.body = { status: "error", message: "删除失败" };
    }
});

/**
 * [修改管理员信息]
 * @type {String}
 */
router.post('/update', async (ctx, next) => {
    var data = JSON.parse(ctx.request.body);
    const { Name } = data;
    const row = await mysql.selectDatabase('Users', `Name == ${Name}`);
    if (row.length != 0) {
        await deleteDatas('Users', `ID == ${id}`);
        await insertDatas('Users', data);
        ctx.body = { status: "ok" };
    } else {
        ctx.body = { status: "error" };
    }
});


export default router;
