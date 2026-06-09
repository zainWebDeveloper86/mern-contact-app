import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const contactSchema = new mongoose.Schema(
  {
    full_name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    address: {
      type: String,
      required: true,
    },
    user_img: {
      type: String,
      default: null,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true
    }
  },
  { timestamps: true },
);

contactSchema.plugin(mongoosePaginate);

const Contacts = mongoose.model("Contact", contactSchema);

export default Contacts;

// db.contacts.insertOne({
//   full_name: 'Zain Ul Abidin',
//   phone: '03289237938',
//   email: 'zain@gmail.com',
//   address:'86 Sahiwal',
// })
