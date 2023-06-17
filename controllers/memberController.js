const { Snowflake } = require("@theinternetfolks/snowflake");

const { Member } = require("../models/memberModel");
const { Success, Error } = require("../utils/response");


async function addMember(req, res){
    try{
        const {user, community, role}= req.body;

        let member= await Member.find({user, community}).lean()

        if(member){
            return res.send(new Failure("User already present in community"));
        }

        member= new Member({
            id: Snowflake.generate(),
            user,
            community,
            role
        })

        await member.save();

        const {id, created_at, updated_at}= member;

        const memberResponseObject= {
            data: {
                id,
                community,
                user,
                role,
                created_at,
                updated_at
            }
        }

        return res.send(new Success(memberResponseObject));
    }catch(error){
        console.error(error.message);
        return res.status(400).send(new Error("Could not create member"));        
    }
}


async function removeMember(req, res){
    try{
        const memberId= req.params.id;

        const member= await Member.findOneAndDelete({id: memberId})

        if(!member){
            return res.send(new Error("Member does not exist in community"))
        }

        return res.send(new Success());
    }catch(error){
        console.error(error.message);
        return res.status(400).send(new Error("Could not remove member"));        
    }
}

module.exports= {
    addMember,
    removeMember
}