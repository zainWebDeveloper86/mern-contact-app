import React from "react";

const Add_Modle = () => {
  return (
    <div className="d-none" id="add_user_info">
      <div className="container">
        <div className="row justify-content-md-center">
          <div className="col-md-8">
            <div className="card">
              <div className="card-header card-title d-flex justify-content-between align-items-center">
                <strong>Add New Contact</strong>
                <i class="fa-solid fa-xmark text-white cursor-pointer"></i>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-12">
                    <div className="form-group row">
                      <label
                        htmlFor="first_name"
                        className="col-md-3 col-form-label"
                      >
                        First Name
                      </label>
                      <div className="col-md-9">
                        <input
                          type="text"
                          name="first_name"
                          id="first_name"
                          className="form-control"
                        />
                      </div>
                    </div>

                    <div className="form-group row">
                      <label
                        htmlFor="last_name"
                        className="col-md-3 col-form-label"
                      >
                        Last Name
                      </label>
                      <div className="col-md-9">
                        <input
                          type="text"
                          name="last_name"
                          id="last_name"
                          className="form-control"
                        />
                      </div>
                    </div>

                    <div className="form-group row">
                      <label
                        htmlFor="email"
                        className="col-md-3 col-form-label"
                      >
                        Email
                      </label>
                      <div className="col-md-9">
                        <input
                          type="text"
                          name="email"
                          id="email"
                          className="form-control"
                        />
                      </div>
                    </div>

                    <div className="form-group row">
                      <label
                        htmlFor="phone"
                        className="col-md-3 col-form-label"
                      >
                        Phone
                      </label>
                      <div className="col-md-9">
                        <input
                          type="text"
                          name="phone"
                          id="phone"
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
                          id="address"
                          rows="3"
                          className="form-control"
                        ></textarea>
                      </div>
                    </div>
                    <div className="form-group row mb-0">
                      <div className="col-md-9 offset-md-3">
                        <button type="submit" className="btn btn-primary">
                          Save
                        </button>
                        <a href="/" className="btn btn-outline-secondary ms-3">
                          Cancel
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Add_Modle;
