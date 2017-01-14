#!/usr/bin/env node
var fs = require('fs')
var configDir = process.env.HOME+'/.mailer'
var isExist = fs.existsSync(configDir)
var nodemailer = require('nodemailer')
var uuid = require('uuid')
var config = require('../config')
var qiniu = require('../mids/qiniu')
var package = require('../package.json')

if(!isExist){
  console.log('~/.mailer文件夹未生成，执行生成')  
  fs.mkdir(configDir,function(err){
    if(err){
      console.log('生成~/.mailer错误')
    }else{
      console.log('生成~/.mailer成功')
    }
  })
}

// 执行其他指令
// process.argv.forEach((val, index) => {
//   console.log(`${index}: ${val}`);
// });

// 用户配置
var args = process.argv.slice(2)

if(/^\-\-config/.test(args[0])){
  // 配置用户信息
  console.log('匹配config')
  if(args[1]){
    fs.writeFileSync(configDir+'/user',args[1])
    return console.log('写入成功')
  }else{
    return console.log('配置用户信息不对')
  }
}else if(/^\-\-send/.test(args[0])){
  // 发送邮件
  var isUserExist = fs.existsSync(configDir+'/user')
  if(isUserExist){
    var userInfo = fs.readFileSync(configDir+'/user').toString()
    var userMail = userInfo.slice(0,userInfo.indexOf(':'))
    var mailOptions = {}

    // 发送邮件
    // from  
      if(/^from\=/.test(args[1])){
        mailOptions.from = args[1].slice(5)+"<"+userMail+">"
      }else{
        return console.log("备注下您是谁吧");
      }
    // to
      if(/^to\=/.test(args[2])){
        mailOptions.to = args[2].slice(3)
      }else{
        return console.log("收件人是谁都不知道，还发个毛线");
      }
    // subject
      if(/^subject\=/.test(args[3])){
        mailOptions.subject = args[3].slice(8)
      }else{
        return console.log("好歹写个主题啊");
      }
    
    // html
      if(/^html\=/.test(args[4])){
        mailOptions.html = args[4].slice(5)
      }else{
        mailOptions.html = "<b>啥都不想说</b>"
      }
    // attach
      if(/^attach\=/.test(args[5])){
        var _temp = args[5].slice(7)
        var filename = _temp.slice(_temp.indexOf('/')+1)

        qiniu.upload(_temp,uuid()+'/'+filename,function(err,result){
          if(err){
            return console.log('附件上传失败，请检查网络或重新尝试')
          }else{
            console.log('附件上传成功')
            mailOptions.html+= "<a href='"+config.qiniu.BASE_URL+result.key+"'>附件📎</a>"
            // 开始发邮件咯
            var transporter = nodemailer.createTransport('smtps://'+userInfo);
             
            // send mail with defined transport object 
            transporter.sendMail(mailOptions, function(error, info){
                if(error){
                    return console.log(error);
                }
              return  console.log('Message sent: ' + info.response);
            });
          }
        })
      }else{
        // 开始发邮件咯
        var transporter = nodemailer.createTransport('smtps://'+userInfo);
         
        // send mail with defined transport object 
        transporter.sendMail(mailOptions, function(error, info){
            if(error){
                return console.log(error);
            }
          return  console.log('Message sent: ' + info.response);
        });
      }


  }else{
  return console.log('请先配置用户信息')
  }
}else if(/^\-\-self/.test(args[0])){
  // 发给自己
  var isUserExist = fs.existsSync(configDir+'/user')
  if(isUserExist){
    var userInfo = fs.readFileSync(configDir+'/user').toString()
    var userMail = userInfo.slice(0,userInfo.indexOf(':'))
    var mailOptions = {}
    mailOptions.from = "自己 <"+userMail+">"
    mailOptions.to = userMail
    mailOptions.html = ""

    // subject
      if(/^subject\=/.test(args[1])){
        mailOptions.subject = args[1].slice(8)
      }else{
        return console.log("好歹写个主题啊");
      }

    // attach
      if(/^attach\=/.test(args[2])){
        var _temp = args[2].slice(7)
        var filename = _temp.slice(_temp.indexOf('/')+1)

        qiniu.upload(_temp,uuid()+'/'+filename,function(err,result){
          if(err){
            return console.log('附件上传失败，请检查网络或重新尝试')
          }else{
            console.log('附件上传成功')
            mailOptions.html+= "<a href='"+config.qiniu.BASE_URL+result.key+"'>附件📎</a>"
            // 开始发邮件咯
            var transporter = nodemailer.createTransport('smtps://'+userInfo);
             
            // send mail with defined transport object 
            transporter.sendMail(mailOptions, function(error, info){
                if(error){
                    return console.log(error);
                }
              return  console.log('Message sent: ' + info.response);
            });
          }
        })
      }else{
        // 开始发邮件咯
        var transporter = nodemailer.createTransport('smtps://'+userInfo);
         
        // send mail with defined transport object 
        transporter.sendMail(mailOptions, function(error, info){
            if(error){
                return console.log(error);
            }
           return console.log('Message sent: ' + info.response);
        });
      }

  }else{
    return console.log('请先配置用户信息')
  }
}else if(/^\-\-help/.test(args[0]) || /^\-h/.test(args[0])){
  // 帮助信息
  console.log('-----Maile '+package.version+'-----')
  console.log('Usage:')
  console.log('      配置本地用户信息')
  console.log('      maile --config xx@163.com:Password@smtp.163.com')
  console.log('      给他人发送邮件(支持带附件上传，目前格式统一，有先后顺序，除了attach参数，其他参数必须传入)')
  console.log('      maile --send from=昵称 to=xx@163.com subject=主题 html="<b>html文本</b>" attach=./Download/xx.png')
  console.log('      给自己发送邮件(支持带附件上传，目前格式统一，有先后顺序，除了attach参数，其他参数必须传入)')
  console.log('      maile --self subject=主题 attach=./Download/xx.png')
}else{
 return console.log('不知道你在干啥米')
}
