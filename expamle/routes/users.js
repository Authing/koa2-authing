const router = require('koa-router')()

router.prefix('/users')

router.get('/', function (ctx, next) {
  console.log('这里是 Authing 中间件')
  console.log(ctx.request.authing)
  ctx.body = 'this is a users response!'
})

router.get('/bar', function (ctx, next) {
  ctx.body = 'this is a users/bar response'
})

module.exports = router
