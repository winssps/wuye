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
    ctx.body = { status: 'ok', datas: row };
});


/**
 * [获取管理员信息,根据id来获取某一个管理员信息]
 * @type {[type]}
 * 
*/
router.get('/:id', async (ctx, next) => {
    var rolelist = [];
    var ex = /[0-9]+/;
    var id = Number(ex.exec(ctx.url));
    const row = await mysql.selectDatabase('Users', `ID == ${id}`);
    const userid = row[0][0];
    //根据 用户id 找用户角色表
    var user_role = await mysql.selectDatabase('user_role', `user_id == ${userid}`);

     for(let i=0; i< user_role.length;i++) {
        var role = await mysql.selectDatabase('role', `id == ${user_role[i][2]}`);
        rolelist.push(role[0]);
     }
    ctx.body = { status: 'ok', datas: row, role: rolelist };
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
   // const regfrom = JSON.parse(ctx.request.fields);
  // const regfrom = {};
 //   console.log(ctx.request.fields);
    const regfrom = ctx.request.fields;
    const { Name } = regfrom;
    const row = await mysql.selectDatabase('Users', `Name == '${Name}'`);
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
  //  var login = JSON.parse(ctx.request.body);    
    const login = ctx.request.fields;
    const { Name, Password } = login;
    const row = await mysql.selectDatabase('Users', `Name == '${Name}'`);
    if (row.length != 0) {
        if (row[0][1] == Name && row[0][2] == Password) {
          /*  const token = jsonwebtoken.sign({
                data: Name,
                // 设置 token 过期时间
                exp: Math.floor(Date.now() / 1000) + (60 * 10), // 60 seconds * 10 minutes = 10分钟
            }, "jwt_secret");
            */
          //  ctx.body = { status: 'ok', token: token};
          ctx.body = { status: 'ok', id: row[0][0]};
        } else {
            ctx.body = { status: 'error', message: "账户密码错误" };
        }
    } else {
        ctx.body = { status: 'error',message: "账户不存在"  };
    }
});

/**
 * [通过用户id查询用户角色]
 * @type {String}
 */
router.get('/userrole/:id/', async (ctx, next) => {
    var rolelist = [];
    var ex = /[0-9][0-9]*/g;
    var userid = Number(ex.exec(ctx.request.url));
   //根据 用户id 找用户角色表
   var user_role = await mysql.selectDatabase('user_role', `user_id == ${userid}`);

   for(let i=0; i< user_role.length;i++) {
      var role = await mysql.selectDatabase('role', `id == ${user_role[i][2]}`);
      rolelist.push(role[0]);
   }
   ctx.body = { status: 'ok', roles: rolelist };
});

/**
 * [删除管理员角色]
 * @type {String}
 */
router.delete('/userrole/:id/:id', async (ctx, next) => {
    var ex = /[0-9][0-9]*/g;
    var roleid = Number(ex.exec(ctx.request.url));
    var userid = Number(ex.exec(ctx.request.url));
    const row = await mysql.selectDatabase('user_role', `role_id == ${roleid} and user_id == ${userid}`);
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
    var data = ctx.request.fields;
    const { id, Name } = data;  
    const numid = Number(id);
    const row = await mysql.selectDatabase('Users', `ID == ${numid}`);
    if (row.length != 0) {
        await mysql.deleteDatas('Users', `ID == ${numid}`);
        await mysql.insertDatas('Users', data);
        ctx.body = { status: "ok" };
    } else {
        ctx.body = { status: "error" };
    }
});


export default router;
