import React, { useState, useEffect, useCallback } from "react";
import { Modal } from "../components";
import { contactBaseUrl } from "../axios";
import { Link, useOutletContext } from "react-router-dom"; // without searchParams
// import { useSearchParams } from "react-router-dom";   // if used searchParams
import { useSearchParams } from "react-router-dom"; //    for pagination
import { toast as toasty } from "react-toastify";
import toast from "react-hot-toast";
const Home = () => {
  // const [searchParams] = useSearchParams();    // if used searchParams
  // const searchTerm = searchParams.get("search") || "";   // if used searchParams
  const { searchTerm } = useOutletContext(); // without searchParams
  const [loading, setLoading] = useState(false);
  const [activeModel, setActiveModel] = useState(null);
  const [singleContactId, setSingleContactId] = useState(null);
  const [singleContact, setSingleContact] = useState(null);
  const [fetchedContacts, setFetchedContacts] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [paginationData, setpaginationData] = useState(null);
  const [contactInfo, setContactInfo] = useState({
    full_name: "",
    phone: "",
    email: "",
    address: "",
    user_img: null,
  });
  const [editContact, setEditContact] = useState({
    full_name: "",
    phone: "",
    email: "",
    address: "",
    user_img: null,
  });

  // get page from URL (default = 1)
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 3;

  // used callback to prevent function from re-rendering (re-creation)
  const getAllContacts = useCallback(async () => {
    try {
      setLoading(true);
      let result;

      if (searchTerm.trim()) {
        result = await contactBaseUrl.get(
          `/search?q=${searchTerm}&page=${page}&limit=${limit}`,
        );
      } else {
        result = await contactBaseUrl.get(`/?page=${page}&limit=${limit}`);
      }

      setFetchedContacts(result?.data?.contacts || []);
      setpaginationData(result?.data);
    } catch (error) {
      const message = error.response?.data?.message || "Something went wrong!";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, limit, page]);

  // ✅ Add debouncing for better performance (Optional)
  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     getAllContacts();
  //   },200);

  //   return () => clearTimeout(timer);
  // }, [searchTerm]);

  useEffect(() => {
    getAllContacts();
  }, [searchTerm, getAllContacts]);

  useEffect(() => {
    if (!singleContactId) return;
    const getSingleContact = async () => {
      try {
        setSingleContact(null);
        const result = await contactBaseUrl.get(`/${singleContactId}`);
        const contact = result?.data?.contact;

        setSingleContact(contact);

        setEditContact({
          full_name: contact.full_name || "",
          email: contact.email || "",
          phone: contact.phone || "",
          address: contact.address || "",
          user_img: null,
        });
        // console.log(result?.data?.contact);
      } catch (error) {
        const message =
          error.response?.data?.message || "Something went wrong!";
        toast.error(message);
      }
    };
    getSingleContact();
  }, [singleContactId]);

  const handleInputFieldChange = (e) => {
    // const name = e.target.name;
    // const value = e.target.value;
    const { name, value } = e.target; // destructure
    setContactInfo({
      ...contactInfo,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setContactInfo({
        ...contactInfo,
        user_img: file,
      });
    }
  };

  const handleEditFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditContact({
        ...editContact,
        user_img: file,
      });
    }
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append("full_name", contactInfo.full_name);
      formData.append("phone", contactInfo.phone);
      formData.append("email", contactInfo.email);
      formData.append("address", contactInfo.address);

      if (contactInfo.user_img) {
        formData.append("user_img", contactInfo.user_img);
      }
      const result = await contactBaseUrl.post("/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (result.status === 201) {
        toasty.success("Contact created successfully!", {
          position: "top-right",
          autoClose: 3000,
        });
        setActiveModel(null);
        await getAllContacts();
        setContactInfo({
          full_name: "",
          phone: "",
          email: "",
          address: "",
          user_img: null,
        });
      }
    } catch (error) {
      const message = error.response?.data?.message || "Something went wrong!";
      toast.error(message);
    }
  };

  const deleteUserContact = async (id) => {
    if (!window.confirm("Are you sure you want to delete this contact?"))
      return;
    try {
      const result = await contactBaseUrl.delete(`/${id}`);
      if (result?.data?.status) toast.success(result?.data?.message);

      setActiveModel(null);
      setSingleContact(null);
      setSingleContactId(null);

      // ✅ Update table immediately without refetch
      // setFetchedContacts((prev) => prev.filter((item) => item._id !== id));

      await getAllContacts();
    } catch (error) {
      const message = error.response?.data?.message || "Something went wrong!";
      toast.error(message);
    }
  };

  const editSubmitForm = async () => {
    try {
      const formData = new FormData();
      formData.append("full_name", editContact.full_name);
      formData.append("phone", editContact.phone);
      formData.append("email", editContact.email);
      formData.append("address", editContact.address);

      if (editContact.user_img) {
        formData.append("user_img", editContact.user_img);
      }

      const result = await contactBaseUrl.put(`/${singleContactId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (result?.data?.status) toast.success(result?.data?.message);
      setActiveModel(null);
      setSingleContact(null);
      setSingleContactId(null);
      await getAllContacts();
      console.log(result);
    } catch (error) {
      const message = error.response?.data?.message || "Something went wrong!";
      toast.error(message);
    }
  };

  const deleteAllRecords = async () => {
    try {
      const confirmed = confirm(
        "⚠️ Are you sure? This will delete ALL contacts permanently!",
      );

      if (!confirmed) return;

      const result = await contactBaseUrl.delete("/");
      const response = result?.data;
      await getAllContacts();
      if (response.status) return toast.success(response.message);
    } catch (error) {
      const message = error.response?.data?.message || "Something went wrong!";
      toast.error(message);
    }
  };

  const getImageUrl = (imageName) => {
    if (!imageName)
      return "https://via.placeholder.com/50/cccccc/969696?text=No+Image";
    return `http://localhost:8000/uploads/${imageName}`;
  };

  const goToPage = (p) => {
    setSearchParams({ page: p, limit });
  };

  const pages = [];

  if (paginationData) {
    for (let p = paginationData.startPage; p <= paginationData.endPage; p++) {
      pages.push(p);
    }
  }
  // console.log(pages)

  // console.log("fetchedContacts:", fetchedContacts);

  return (
    <div className="py-5">
      {/* Show all records */}
      {/* Loading indicator */}
      {loading && (
        <div className="text-center my-3">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <div className="card">
              <div className="card-header card-title">
                <div className="d-flex align-items-center justify-content-between">
                  <h2 className="mb-0">
                    All Contacts: {paginationData?.totalDocs}
                  </h2>
                  <div className="d-flex align-items-center gap-3">
                    {fetchedContacts.length > 2 ? (
                      <button
                        onClick={deleteAllRecords}
                        type="button"
                        className="btn btn-danger"
                      >
                        <i className="fa-solid fa-trash"></i> Delete All
                      </button>
                    ) : (
                      ""
                    )}
                    <button
                      className="btn btn-success"
                      onClick={() => setActiveModel("add")}
                    >
                      <i className="fa fa-plus-circle"></i> Add New
                    </button>
                  </div>
                </div>
              </div>
              <div className="card-body">
                <table className="table table-striped table-hover align-middle">
                  <thead>
                    <tr>
                      <th scope="col" className="col-1">
                        #
                      </th>
                      <th scope="col" className="col-2">
                        Image
                      </th>
                      <th scope="col" className="col-2">
                        Full Name
                      </th>
                      <th scope="col" className="col-3">
                        Email
                      </th>
                      <th scope="col" className="col-2">
                        Phone
                      </th>
                      <th scope="col" className="col-2">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {fetchedContacts.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="text-center py-4">
                          <div className="text-muted">
                            <i className="fa fa-users fa-3x mb-3"></i>
                            <h5>No contacts found</h5>
                            {searchTerm ? (
                              <p>No results for "{searchTerm}"</p>
                            ) : (
                              <p>
                                Add your first contact using the "Add New"
                                button
                              </p>
                            )}
                          </div>
                        </td>
                      </tr>
                    ) : (
                      fetchedContacts?.map((contact, index) => (
                        <tr key={contact._id}>
                          <td>{index + 1}</td>
                          <td>
                            <img
                              src={getImageUrl(contact.user_img)}
                              alt={contact.full_name}
                              id="user_img"
                              className="rounded-circle"
                              style={{
                                width: "50px",
                                height: "50px",
                                objectFit: "cover",
                              }}
                            />
                          </td>
                          <td>{contact.full_name}</td>
                          <td>{contact.email}</td>
                          <td>{contact.phone}</td>
                          <td>
                            <div className="d-flex gap-2 align-items-center">
                              <button
                                className="btn btn-sm btn-circle btn-outline-info"
                                onClick={() => {
                                  setSingleContactId(contact._id);
                                  setActiveModel("show");
                                  return;
                                }}
                              >
                                <i className="fa fa-eye"></i>
                              </button>
                              <button
                                className="btn btn-sm btn-circle btn-outline-secondary"
                                onClick={() => {
                                  setSingleContactId(contact._id);
                                  setActiveModel("edit");
                                  return;
                                }}
                              >
                                <i className="fa fa-edit"></i>
                              </button>
                              <button
                                className="btn btn-sm btn-circle btn-outline-danger"
                                onClick={() => deleteUserContact(contact._id)}
                              >
                                <i className="fa fa-times"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
                {paginationData?.totalPages > 1 && (
                  <nav className="mt-4">
                    <ul className="pagination justify-content-center">
                      {/* Previous */}
                      <li
                        className={`page-item ${!paginationData?.hasPrevPage ? "disabled" : ""}`}
                      >
                        <button
                          className="page-link z-0"
                          onClick={() => goToPage(paginationData.prevPage)}
                        >
                          Previous
                        </button>
                      </li>

                      {/* Page Numbers */}

                      {paginationData &&
                        pages.map((p) => (
                          <li
                            key={p}
                            className={`page-item ${p === paginationData.currentPage ? "active" : ""}`}
                          >
                            <button
                              className="page-link z-0"
                              onClick={() => goToPage(p)}
                            >
                              {p}
                            </button>
                          </li>
                        ))}

                      {/* Next */}
                      <li
                        className={`page-item ${!paginationData?.hasNextPage ? "disabled" : ""}`}
                      >
                        <button
                          className="page-link z-0"
                          onClick={() => goToPage(paginationData.nextPage)}
                        >
                          Next
                        </button>
                      </li>
                    </ul>
                  </nav>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/*       =======================  Models  =================== */}

      {/* Add User model */}
      {activeModel === "add" ? (
        <Modal title="Add New Contact" onClose={() => setActiveModel(null)}>
          <div className="row">
            <div className="col-md-12 d-flex flex-column gap-2">
              <div className="form-group row">
                <label htmlFor="full_name" className="col-md-3 col-form-label">
                  Full Name
                </label>
                <div className="col-md-9">
                  <input
                    type="text"
                    name="full_name"
                    value={contactInfo.full_name}
                    onChange={handleInputFieldChange}
                    className="form-control"
                    required
                  />
                </div>
              </div>

              <div className="form-group row">
                <label htmlFor="phone" className="col-md-3 col-form-label">
                  Phone
                </label>
                <div className="col-md-9">
                  <input
                    type="text"
                    name="phone"
                    value={contactInfo.phone}
                    onChange={handleInputFieldChange}
                    className="form-control"
                    required
                  />
                </div>
              </div>

              <div className="form-group row">
                <label htmlFor="email" className="col-md-3 col-form-label">
                  Email
                </label>
                <div className="col-md-9">
                  <input
                    type="email"
                    name="email"
                    value={contactInfo.email}
                    onChange={handleInputFieldChange}
                    className="form-control"
                    required
                  />
                </div>
              </div>

              <div className="form-group row">
                <label htmlFor="name" className="col-md-3 col-form-label">
                  Address
                </label>
                <div className="col-md-9">
                  <textarea
                    name="address"
                    value={contactInfo.address}
                    onChange={handleInputFieldChange}
                    rows="3"
                    className="form-control"
                    required
                  ></textarea>
                </div>
              </div>

              <div className="form-group row">
                <label htmlFor="user_img" className="col-md-3 col-form-label">
                  Profile Image (Optional)
                </label>
                <div className="col-md-9">
                  <input
                    type="file"
                    name="user_img"
                    className="form-control"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                  <small className="text-muted">Max 3MB, JPG/PNG only</small>
                </div>
              </div>

              <div className="form-group row mt-2">
                <div className="col-md-9 offset-md-3">
                  <button
                    onClick={handleSubmit}
                    type="submit"
                    className="btn btn-primary"
                    disabled={
                      !contactInfo.full_name ||
                      !contactInfo.phone ||
                      !contactInfo.email ||
                      !contactInfo.address
                    }
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveModel(null)}
                    className="btn btn-outline-secondary ms-3"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      ) : (
        ""
      )}

      {/* Show User model */}
      {activeModel === "show" ? (
        <Modal title="Contact Details" onClose={() => setActiveModel(null)}>
          <div className="row">
            <div className="col-md-12 d-flex flex-column gap-2">
              <div className="form-group row">
                <label htmlFor="user_img" className="col-md-3 col-form-label">
                  Your Image
                </label>
                <div className="col-md-9">
                  <img
                    src={getImageUrl(singleContact?.user_img)}
                    alt={singleContact?.full_name}
                    className="rounded-circle mb-3"
                    style={{
                      width: "120px",
                      height: "120px",
                      objectFit: "cover",
                    }}
                  />
                </div>
              </div>

              <div className="form-group row">
                <label htmlFor="full_name" className="col-md-3 col-form-label">
                  Full Name
                </label>
                <div className="col-md-9">
                  <p className="form-control-plaintext text-muted">
                    {singleContact?.full_name}
                  </p>
                </div>
              </div>

              <div className="form-group row">
                <label htmlFor="email" className="col-md-3 col-form-label">
                  Email
                </label>
                <div className="col-md-9">
                  <p className="form-control-plaintext text-muted">
                    {singleContact?.email}
                  </p>
                </div>
              </div>

              <div className="form-group row">
                <label htmlFor="phone" className="col-md-3 col-form-label">
                  Phone
                </label>
                <div className="col-md-9">
                  <p className="form-control-plaintext text-muted">
                    {singleContact?.phone}
                  </p>
                </div>
              </div>

              <div className="form-group row">
                <label htmlFor="name" className="col-md-3 col-form-label">
                  Address
                </label>
                <div className="col-md-9">
                  <p className="form-control-plaintext text-muted">
                    {singleContact?.address}
                  </p>
                </div>
              </div>
              <div className="form-group row mt-2">
                <div className="col-md-9 offset-md-3">
                  <button
                    className="btn btn-info"
                    onClick={() => setActiveModel("edit")}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-outline-danger ms-3"
                    onClick={() => deleteUserContact(singleContact._id)}
                  >
                    Delete
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveModel(null)}
                    className="btn btn-outline-secondary ms-3"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      ) : (
        ""
      )}

      {/* Edit User model */}
      {activeModel === "edit" ? (
        <Modal title="Edit Contact" onClose={() => setActiveModel(null)}>
          <div className="row">
            <div className="col-md-12 d-flex flex-column gap-2">
              <div className="form-group row">
                <label htmlFor="full_name" className="col-md-3 col-form-label">
                  Full Name
                </label>
                <div className="col-md-9">
                  <input
                    type="text"
                    name="full_name"
                    value={editContact.full_name}
                    onChange={(e) =>
                      setEditContact({
                        ...editContact,
                        full_name: e.target.value,
                      })
                    }
                    className="form-control"
                  />
                </div>
              </div>

              <div className="form-group row">
                <label htmlFor="email" className="col-md-3 col-form-label">
                  Email
                </label>
                <div className="col-md-9">
                  <input
                    type="email"
                    name="email"
                    value={editContact.email}
                    onChange={(e) =>
                      setEditContact({ ...editContact, email: e.target.value })
                    }
                    className="form-control"
                  />
                </div>
              </div>

              <div className="form-group row">
                <label htmlFor="phone" className="col-md-3 col-form-label">
                  Phone
                </label>
                <div className="col-md-9">
                  <input
                    type="text"
                    name="phone"
                    value={editContact.phone}
                    onChange={(e) =>
                      setEditContact({ ...editContact, phone: e.target.value })
                    }
                    className="form-control"
                  />
                </div>
              </div>

              <div className="form-group row">
                <label htmlFor="name" className="col-md-3 col-form-label">
                  Address
                </label>
                <div className="col-md-9">
                  <textarea
                    name="address"
                    onChange={(e) =>
                      setEditContact({
                        ...editContact,
                        address: e.target.value,
                      })
                    }
                    value={editContact.address}
                    rows="3"
                    className="form-control"
                  ></textarea>
                </div>
              </div>

              {/* Current Image */}
              {singleContact?.user_img && (
                <div className="d-flex align-items-center gap-5">
                  <label className="form-label">Current Image</label>
                  <div className="ms-3">
                    <img
                      src={getImageUrl(singleContact?.user_img)}
                      alt="Current"
                      className="img-thumbnail"
                      style={{
                        width: "100px",
                        height: "100px",
                        objectFit: "cover",
                      }}
                    />
                  </div>
                </div>
              )}

              <div className="form-group row">
                <label htmlFor="user_img" className="col-md-3 col-form-label">
                  {singleContact?.user_img ? "Change Image" : "Upload Image"}
                </label>
                <div className="col-md-9">
                  <input
                    type="file"
                    name="user_img"
                    accept="image/*"
                    onChange={handleEditFileChange}
                    className="form-control"
                  />
                  <small className="text-muted">
                    Leave empty to keep current image
                  </small>
                </div>
              </div>

              <div className="form-group row mt-2">
                <div className="col-md-9 offset-md-3">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    onClick={editSubmitForm}
                  >
                    Update Contact
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveModel(null)}
                    className="btn btn-outline-secondary ms-3"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      ) : (
        ""
      )}
    </div>
  );
};

export default Home;
