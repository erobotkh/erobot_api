import asyncHandler from 'express-async-handler'
import Member from '../models/member_model.js'
import socialSchema from '../models/schema/social_schema.js'
import Team from '../models/team_model.js'
import { buildItemsSerializer, buildObjectSerializer } from '../utils/json_serializer.js'
import { sheetToObject } from '../utils/sheet_to_object.js'

const fetchMembers = () => asyncHandler(async (req, res) => {
  const per_page = parseInt(req.query.per_page) || 20
  const page = parseInt(req.query.page) || 1

  const options = {
    page: page,
    limit: per_page,
    populate: 'team',
  }

  const members = await Member.paginate({}, options)
  const _members = buildItemsSerializer({
    items: members,
    attributeSchema: Member.schema,
    request: req,
    relationships: {
      'socials': socialSchema,
      'team': Team.schema,
    },
  })

  res.send(_members)
})

// should put in its own controller
const fetchTeams = () => asyncHandler(async (req, res) => {
  const per_page = parseInt(req.query.per_page) || 20
  const page = parseInt(req.query.page) || 1

  const options = {
    page: page,
    limit: per_page,
  }

  const teams = await Team.paginate({}, options)
  const _teams = buildItemsSerializer({
    items: teams,
    attributeSchema: Team.schema,
    request: req,
    relationships: {},
  })

  res.send(_teams)
})

const teamEp = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQyePcJTIb04hY14Oh-bEVJiD54SyeL59_FvMa_1SZeCDjP_EE8Pms6GAuI0ag0O_BO5PleE_tt2kDP/pub?gid=946330072&single=true&output=csv'
const memberEp = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQyePcJTIb04hY14Oh-bEVJiD54SyeL59_FvMa_1SZeCDjP_EE8Pms6GAuI0ag0O_BO5PleE_tt2kDP/pub?gid=0&single=true&output=csv'

const refreshMembers = () => asyncHandler(async (req, res) => {
  const tObjects = await sheetToObject(teamEp)
  await Team.deleteMany()
  await Member.deleteMany()
  await Team.insertMany(tObjects)

  // member
  const mObjects = await sheetToObject(memberEp)
  var members = {}

  for (const obj of mObjects) {
    let socials = {}

    if (obj.google) {
      socials['google'] = {
        "provider": 'google',
        "href": obj.google,
      }
    }

    if (obj.telegram) {
      socials['telegram'] = {
        "provider": 'telegram',
        "href": obj.telegram,
      }
    }

    if (obj.facebook) {
      socials['facebook'] = {
        "provider": 'facebook',
        "href": obj.facebook,
      }
    }

    if (obj.phone) {
      socials['phone'] = {
        "provider": 'phone',
        "href": obj.phone,
      }
    }

    let team = await Team.findOne({ 'id': obj.team })

    const member = {
      "username": obj.id,
      "role": obj.role,
      "first_name": obj.first_name,
      "last_name": obj.last_name,
      "profile_url": obj.profile_url,
      "socials": objectValues(socials),
      "team": team._id,
    };

    members[obj.id] = member;
  };

  try {
    var result = await Member.create(objectValues(members))
    res.send({
      message: "Refreshed!"
    })
  } catch (error) {
    res.send({
      message: "Refresh fail!",
      debug: error,
    })
  }
})


function objectValues(obj) {
  let vals = [];
  for (const prop in obj) {
    vals.push(obj[prop]);
  }
  return vals;
}

export { fetchMembers, refreshMembers, fetchTeams }