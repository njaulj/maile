### Maile
-------------

> 在日常开发生活中，习惯了用邮件来保存、发送文件，或者从服务器拷贝文件

```javascript
console.log('-----Maile '+package.version+'-----')
console.log('Usage:')
console.log('      配置本地用户信息')
console.log('      maile --config xx@163.com:Password@smtp.163.com')
console.log('      给他人发送邮件(支持带附件上传，目前格式统一，有先后顺序，除了attach参数，其他参数必须传入)')
console.log('      maile --send from=昵称 to=xx@163.com subject=主题 html="<b>html文本</b>" attach=./Download/xx.png')
console.log('      给自己发送邮件(支持带附件上传，目前格式统一，有先后顺序，除了attach参数，其他参数必须传入)')
console.log('      maile --self subject=主题 attach=./Download/xx.png')
```