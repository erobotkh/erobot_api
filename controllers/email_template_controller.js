
import asyncHandler from 'express-async-handler'
import ejs from 'ejs'

const renderEmailTemplate = () => asyncHandler(async (_, res) => {
  try {
    ejs.renderFile('./ejs/email_confirmation.ejs', {
      head_name: "Cambodia Geography",
      action_url: "cambodia-geography.com",
      title: "Verify your email address",
      subtitle: "Thanks for signing up for Cambodia Geography! We're excited to have you as an early user.",
      verify_button_label: "Verify Email",
      thanks: "Thanks, ",
      send_by: "The Cambodia Geography Team",
      issue_message: "If you’re having trouble clicking the button, copy and paste the URL below into your web browser.",
      office: "Cambodia Academy of Digital Technology (CADT)",
      office_location: "National Road 6A, Kthor, Prek Leap ChroyChangvar, Phnom Penh",
    }, {}, function (err, str) {
      if (err) {
        res.status(500).send({
          message: err.toString(),
        })
      } else {
        res.status(200).send(str)
      }
    });
  } catch (err) {
    res.status(500).send({
      message: err,
    })
  }
})

export default renderEmailTemplate