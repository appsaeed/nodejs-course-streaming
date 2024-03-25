const Contact = require('../model/Contact');

class ContactController {


    /**
     * Create view and logic for index
     * @param {import('express').Request} req 
     * @param {import('express').Response} res
     */
    static async index(req, res){  
        res.render('contact')
    }

    /**
     * Create view and logic for index
     * @param {import('express').Request} req 
     * @param {import('express').Response} res
     */
    static async store(req, res) {

        if(!(req.body?.name) && !(req.body?.email)){
            req.flash('messages', ['Please enter a name and email address'])
            return res.redirect('back');
        }

        if(!(req.body?.message)){
            req.flash('messages', ['Please enter your message'])
            return res.redirect('back');
        }

        const data = {
            name: req.body.name,
            email: req.body.email,
            number: req.body?.number || '',
            message: req.body.message
        }

        try {
            if((await Contact.create(data))){
                req.flash('messages', ['Your message has been sent we will try to respond with you as soon as possible'])
                return res.redirect('back');
            }  
            req.flash('messages', ['Something went wrong, unable to send message'])
                return res.redirect('back');
        } catch (error) {
            return res.send(error)
        }
    }
}
module.exports = ContactController;