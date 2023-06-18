const { Snowflake } = require("@theinternetfolks/snowflake");

const { Member } = require("../models/memberModel");
const { Success, Error } = require("../utils/response");
const { Community } = require("../models/communityModel");

const {
    COMMUNITY_ADMIN,
    COMMUNITY_MODERATOR,
    getRole
}= require('../utils/roles');


async function addMember(req, res){
    try{
        const {user, community, role}= req.body;

        let member= await Member.findOne({user, community}).lean()

        if(member){
            return res.send(new Error("User already present in community"));
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
    const {id: user}= req.user;
    try{
        const memberId= req.params.id;

        const member= await Member.findOne({id: memberId}).lean();

        if(!member){
            return res.send(new Error("Member not found.", "RESOURCE_NOT_FOUND"))
        }

        const communityId= member.community;

        const role= getRole(user, communityId);

        if(role !== COMMUNITY_ADMIN || role!==COMMUNITY_MODERATOR){
            return res.send(
                new Error(
                    "You are not authorized to perform this action.",
                    "NOT_ALLOWED_ACCESS"
                )
            );
        }

        await Member.findOneAndRemove({id: memberId});
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