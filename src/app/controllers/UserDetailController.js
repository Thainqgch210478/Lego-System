const Account = require('../models/Account');
const User = require('../models/User');

const {convertToObject} = require('../../util/mongoose');
const {convertToArrayObjects} = require('../../util/mongoose');
const {hashPassword} = require('../../security/hash');
const {comparePassword} = require('../../security/hash');
const { ObjectId } = require('mongodb');
var url = 'mongodb://127.0.0.1:27017';
var MongoClient = require('mongodb').MongoClient;

class UserDetailController {
    //[GET] /news
    detail(req, res) {
        User.findOne({account: new ObjectId(req.signedCookies.userId)}).populate('account').then(user=>{
           User.find({}).then(users=>{
            console.log({user: convertToObject(user),users});
            res.render('user/detail',{user:convertToObject(user),users:convertToArrayObjects(users)})
           })
        })
        .catch(err=>console.log(err))
    }

    logout(req,res,next){
        res.clearCookie('userId');
        res.clearCookie('adminId');
        // REDIRECT OT HOME
        res.redirect('/');
    }

    changePassword(req,res){
       res.render('user/changePassword') ;
    }

    changePasswordSave(req,res){
        Account.findOne({
            _id:req.signedCookies.userId
        }).then(account=>{
            const isPassword = comparePassword(req.body.currentPassword,account.password) 
            if(isPassword){
                const newPassword = hashPassword(req.body.newPassword) ;
                Account.updateOne({_id:req.signedCookies.userId},{password:newPassword}).then(
                    res.render('user/changePassword')
                )
            }else{
                res.render('user/changePassword', {
                    message: 'Password Wrong'
                })
                
            }
        })
    }
}
//make object NewsController to use in another file
module.exports = new UserDetailController();