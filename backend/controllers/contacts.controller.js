import path from "path";
import Contacts from "../models/contacts.model.js";
import fs from "fs";

export const getAllContacts = async (req, res) => {
  try {
    const { page = 1, limit = 3 } = req.query;
    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
    };
    // const contacts = await Contacts.find(); through simple
    const contacts = await Contacts.paginate({ userId: req.user._id }, options);

    const currentPage = contacts.page;
    const totalPages = contacts.totalPages;

    const startPage = Math.max(1, currentPage - 1);
    const endPage = Math.min(totalPages, currentPage + 1);

    // console.log(`startPage: ${startPage}, endPage: ${endPage}`);

    return res.status(200).json({
      message: "All records fetched Successfully!",
      status: true,
      totalDocs: contacts.totalDocs,
      limit: contacts.limit,
      totalPages,
      currentPage,
      pageCounter: contacts.pagingCounter,
      hasPrevPage: contacts.hasPrevPage,
      hasNextPage: contacts.hasNextPage,
      prevPage: contacts.prevPage,
      nextPage: contacts.nextPage,
      contacts: contacts.docs,
      startPage,
      endPage,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message, status: false });
  }
};

export const getSingleContact = async (req, res) => {
  try {
    const user_id = req.params.id;
    const contact = await Contacts.findOne({
      _id: user_id,
      userId: req.user._id,
    });
    if (!contact)
      return res.status(404).json({
        message: "Contact not found!",
        status: false,
      });

    return res.status(200).json({
      message: "Record fetched Successfully!",
      status: true,
      contact: contact,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message, status: false });
  }
};

export const addContactUser = async (req, res) => {
  try {
    const { full_name, phone, email, address } = req.body; // destructuring a object
    if (!full_name || !phone || !email || !address) {
      return res
        .status(400)
        .json({ message: "All fields are required!", status: false });
    }

    const userContact = new Contacts({
      full_name,
      phone,
      email,
      address,
      user_img: req.file ? req.file.filename : null,
      userId: req.user._id,
    });

    const userContactData = await userContact.save();
    return res.status(201).json({
      message: "Record Created Successfully!",
      status: true,
      id: userContactData?._id,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message, status: false });
  }
};

export const updateContactUser = async (req, res) => {
  try {
    const user_id = req.params.id;
    const body = req.body;

    const hasData =
      body &&
      (body.full_name || body.phone || body.email || body.address || req.file);

    if (!hasData) {
      return res.status(400).json({
        message: "No data to update",
        status: false,
      });
    }

    const contact = await Contacts.findOne({
      _id: user_id,
      userId: req.user._id,
    });
    if (!contact)
      return res
        .status(404)
        .json({ message: "Contact not found!", status: false });

    if (body.full_name) contact.full_name = body.full_name;
    if (body.phone) contact.phone = body.phone;
    if (body.email) contact.email = body.email;
    if (body.address) contact.address = body.address;
    if (req.file) {
      if (contact.user_img) {
        const filePath = path.join("./uploads", contact.user_img);
        fs.unlink(filePath, (error) =>
          console.log("Failed to delete old image: ", error),
        );
      }
      contact.user_img = req.file.filename;
    }

    const updated = await contact.save();

    return res.status(200).json({
      message: "Record updated successfully!",
      status: true,
      data: updated,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message, status: false });
  }
};

export const deleteContactUser = async (req, res) => {
  try {
    const user_id = req.params.id;
    const contact = await Contacts.findByIdAndDelete({
      _id: user_id,
      userId: req.user._id,
    });
    if (!contact)
      return res
        .status(404)
        .json({ message: "Contact not found", status: false });
    if (contact.user_img) {
      const filePath = path.join("uploads", contact.user_img);
      fs.unlink(filePath, (error) => {
        if (error) {
          console.log("Failed to delete image:", error.message);
        }
      });
    }
    return res
      .status(200)
      .json({ message: "Contact Deleted Successfully!", status: true });
  } catch (error) {
    return res.status(500).json({ message: error.message, status: false });
  }
};

export const deleteAllContacts = async (req, res) => {
  try {
    const contacts = await Contacts.find();

    contacts.forEach((contact) => {
      if (contact.user_img) {
        const filePath = path.join("./uploads", contact.user_img);
        fs.unlink(filePath, (error) => {
          if (error) {
            console.log("Failed to delete image:", error.message);
          }
        });
      }
    });

    const result = await Contacts.deleteMany({ userId: req.user._id });
    res.status(200).json({
      message: `All records deleted (${result.deletedCount})!`,
      status: true,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message, status: false });
  }
};

export const searchContact = async (req, res) => {
  try {
    const { q, page = 1, limit = 3 } = req.query;

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
    };

    let contacts;

    if (!q || q.trim() === "") {
      // Agar empty search hai toh sab contacts return karo
      contacts = await Contacts.paginate({}, options);
    } else {
      contacts = await Contacts.paginate(
        {
          userId: req.user._id,
          $or: [
            { full_name: { $regex: q, $options: "i" } },
            { email: { $regex: q, $options: "i" } },
            { phone: { $regex: q } },
          ],
        },
        options,
      );
    }
    const currentPage = contacts.page;
    const totalPages = contacts.totalPages;

    const startPage = Math.max(1, currentPage - 1);
    const endPage = Math.min(totalPages, currentPage + 1);

    // console.log(`startPage: ${startPage}, endPage: ${endPage}`);

    res.status(200).json({
      message: "All records fetched Successfully!",
      status: true,
      totalDocs: contacts.totalDocs,
      limit: contacts.limit,
      totalPages,
      currentPage,
      pageCounter: contacts.pagingCounter,
      hasPrevPage: contacts.hasPrevPage,
      hasNextPage: contacts.hasNextPage,
      prevPage: contacts.prevPage,
      nextPage: contacts.nextPage,
      contacts: contacts.docs,
      startPage,
      endPage,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
