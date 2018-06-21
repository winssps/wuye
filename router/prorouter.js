import Router from "koa-router";
import crypto from 'crypto';
import jsonwebtoken from 'jsonwebtoken';


import mysql from '../config2';

import Repair from './repair.js';
import User from './user.js';
import Owner from './owner.js';
import Charge from './charge.js';
import Visit from './visit.js'

const router = new Router();


router.use('/repair', Repair.routes(), Repair.allowedMethods());  //用户相关的路由
router.use('/user', User.routes(), User.allowedMethods());  //用户相关的路由
router.use('/owner', Owner.routes(), Owner.allowedMethods());  //用户相关的路由
router.use('/charge', Charge.routes(), Charge.allowedMethods());  //用户相关的路由
router.use('/visit', Visit.routes(), Visit.allowedMethods());  //用户相关的路由



router.get('/', async (ctx, next) => {

    ctx.body = "hello pro_Servers";
});

/**
 * [获取角色列表]
 * @type {String}
 */
router.get('/role', async (ctx, next) => {
    const row = await mysql.selectDatabase('role', 'true');
    ctx.body = { status: 'ok', roles: row };
});

/**
 * [为管理员添加角色]
 * @type {String}
 */
router.get('/role/:id/:id', async (ctx, next) => {
    var ex = /[0-9][0-9]*/g;
    var userid = Number(ex.exec(ctx.request.url));
    var roleid = Number(ex.exec(ctx.request.url));
    var row = await mysql.selectDatabase("user_role", `role_id == ${roleid}`);
    if(row.length != 0) {
        ctx.body = { status: 'error' };
    } else {
        await mysql.insertDatas("user_role", { user_id: userid, role_id: roleid })
        ctx.body = { status: 'ok' };
    }
});

/**
 * [添加角色]
 * @type {String}
 */
router.post('/role', async (ctx, next) => {
    var data = ctx.request.fields;
    await mysql.insertDatas("role", data);
    ctx.body = { status: 'ok' };
});

/**
 * [角色删除]
 * @type {String}
 */
router.delete('/role/:id', async (ctx, next) => {
    var ex = /[0-9][0-9]*/;
    var roleid = ex.exec(ctx.request.url);
    const row = await mysql.selectDatabase('role', `id == ${roleid}`);
    if (row.length != 0) {
        await mysql.deleteDatas("role", `id == ${roleid}`);
        await mysql.deleteDatas('user_role', `role_id == ${roleid}`);
        await mysql.deleteDatas("role_permission", `role_id == ${roleid}`);
        ctx.body = { status: "ok" };
    } else {
        ctx.body = { status: "error" };
    }
});

/**
 * [获取全部权限列表]
 * @type {String}
 */
router.get('/per', async (ctx, next) => {

    var row = await mysql.selectDatabase("permission", 'true');
    ctx.body = { status: 'ok', permissions: row };
});

/**
 * [为角色添加权限]
 * @type {[type]}
 */
router.get('/per/:id/:id', async (ctx, next) => {
    var ex = /[0-9][0-9]*/g;
    var roleid = Number(ex.exec(ctx.request.url));
    var perid = Number(ex.exec(ctx.request.url));
    var row = await mysql.selectDatabase('role_permission', `permission_id == ${perid}`);
    console.log(row);
    if(row.length != 0) {
        ctx.body = { status: 'error' };
    } else {
        await mysql.insertDatas("role_permission", { role_id: roleid, permission_id: perid })
        ctx.body = { status: 'ok' };
    }
});

/**
 * [根据角色id 获取所有角色的所有权限]
 * @type {[type]}
 */
router.get('/per/:id', async (ctx, next) => {
    var rolelist = [];
    var ex = /[0-9][0-9]*/g;
    var roleid = Number(ex.exec(ctx.request.url));
    var row = await mysql.selectDatabase("role_permission",  `role_id == ${roleid}` );
    for(let i = 0;i < row.length;i++) {
        var role = await mysql.selectDatabase('permission', `id == ${row[i][2]}`);
        rolelist.push(role[0]);
    }
    ctx.body = { status: 'ok', datas: rolelist};
});

/*

router.post('/register', async (ctx) => {
    var fields = ctx.request.body;
    var register = JSON.parse(fields);
    const {userName, password, repassword, email, invite} = register;
    console.log(register);
    let result = await User.find({username: userName});
    if(result.length > 0) {
      ctx.body = {
        message: "用户名已注册",
      };
      ctx.status = 401;
    } else {

        let hexpassword = crypto.createHash('sha1').update(password).digest("hex");
        let hexrepassword = crypto.createHash('sha1').update(repassword).digest("hex");

        if(hexpassword === hexrepassword) {
          let result = await User({
            uid: 1123546,
            username: userName,
            userpassword: hexrepassword,
            createTime: new Date(),
            lastLogin: null,
            email: email,
            invite: invite
          }).save();
         ctx.body = {
          message: "注册成功",
        };
        ctx.status = 200;

      } else {
        ctx.body = {
          message: "两次密码不正确",
        };
        ctx.status = 401;
      }
    }
});

//登录请求验证
router.post('/login', async (ctx, next) => {
  //  console.log(ctx.request.fields);

    var fields = ctx.request.body;
    var login = JSON.parse(fields);
    const {userName, password, remember} = login;

    // 做加密处理 /
    let shasum = crypto.createHash('sha1');
    shasum.update(password);
    var hexpassword = shasum.digest('hex');

    let ret = await User.find({ username: userName });
    try {
        if(ret.length > 0) { //有结果表示有相应的用户
            if (ret[0].userpassword == hexpassword) {
                ctx.status = 200;
                const token = jsonwebtoken.sign({
                        data: ret[0].username,
                        // 设置 token 过期时间
                        exp: Math.floor(Date.now() / 1000) + (60 * 10), // 60 seconds * 10 minutes = 10分钟
                    }, secret);

                ctx.body = {
                    message: '登录成功',
                    user: ret[0].username,
                    // 生成 token 返回给客户端
                    token: token,
                }
            } else { //用户名密码不正确
                ctx.status = 401;
                ctx.body = {
                    message: '密码错误',
                }
            }
        } else { //用户名密码不正确
            ctx.status = 401;
            ctx.body = {
                message: '用户名错误',
            }
            return;
        }
    } catch (error) {
      console.log(error);
        ctx.throw(500);

    }
});

*/

export default router;
