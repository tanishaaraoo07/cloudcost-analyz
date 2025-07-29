import React from "react";
import heroImage from "../assets/hero-image.png";
import tanishaImg from "../assets/tanisha.jpg";
import contactImg from "../assets/contact.png";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="home-wrapper">
      {/* Hero Section */}
      <section className="py-5 px-3" style={{ backgroundColor: "#1F1F1F", color: "white" }}>
        <div className="w-100 d-flex flex-column flex-md-row justify-content-center align-items-center gap-5">
          <div className="text-center text-md-start">
            <h1 className="display-5 fw-bold">CloudCost Analyzer</h1>
            <p className="lead">Welcome to the services</p>
            <Link to="/explore">
              <button className="btn mt-2" style={{ backgroundColor: "#25C39F", color: "white" }}>
                Explore Now
              </button>
            </Link>
          </div>
          <img src={heroImage} alt="Hero" className="img-fluid mt-4 mt-md-0" style={{ maxWidth: "400px" }} />
        </div>
      </section>

      {/* Directory Section */}
      <section className="py-5 text-center w-100" style={{ backgroundColor: "#25C39F", color: "white" }}>
        <h2 className="fw-bold">Directory</h2>
        <div className="d-flex flex-column align-items-center mt-4">
          {[
            "Select Cloud Provider",
            "Enter Resources / Load Existing",
            "Compare Costs",
            "View Mapped Services",
            "Generate Report",
          ].map((step, idx) => (
            <div key={idx} className="mb-3">
              <div className="px-4 py-2 rounded-pill bg-white text-dark fw-semibold">{step}</div>
              {idx !== 4 && <div className="text-white">↓</div>}
            </div>
          ))}
        </div>
      </section>

      {/* About Section */}
      <section className="py-5 px-4 bg-white">
        <div className="w-100 d-flex flex-column flex-md-row align-items-center justify-content-center">
          <img
            src={tanishaImg}
            alt="Tanisha"
            className="rounded-circle mb-4 mb-md-0"
            style={{ width: "180px", height: "180px", objectFit: "cover" }}
          />
          <div className="ms-md-4">
            <h3 className="fw-bold" style={{ color: "#25C39F" }}>About the Creator</h3>
            <p className="mt-3">
              Hi, I'm Tanisha, a cloud-native developer passionate about solving real-world cloud migration challenges.
              <br />
              I built CloudCost Analyzer to simplify the decision-making process for migrating services across AWS, Azure, and GCP.
              <br />
              This tool uses modern cloud SDKs, React.js, FastAPI, and MongoDB to provide accurate cost comparison, service mapping, and PDF generation.
              <br />
              As part of my DevOps journey, I implemented CI/CD with GitHub Actions, containerized using Docker, and deployed with Vercel and Render.
              <br />
              Hope this helps developers and architects make smarter cloud decisions.
            </p>
            <p className="fw-bold" style={{ color: "#25C39F" }}>– Tanisha</p>
          </div>
        </div>
      </section>

      {/* Contact + Connect Us Section */}
      <section className="py-5 px-4" style={{ backgroundColor: "#25C39F", color: "white" }}>
        <div className="w-100 d-flex flex-column flex-md-row align-items-start justify-content-between gap-5 px-md-5">
          {/* Contact Info */}
          <div style={{ flex: 1 }}>
            <h3 className="fw-bold">Contact Information</h3>
            <p className="mb-1">📞 7000000917</p>
            <p className="mb-1">📧 damalatanisha7@gmail.com</p>
            <p className="mb-1">🏫 Silicon University</p>
            <p>🌐 https://cloudcost-analyz.vercel.app/</p>
            <img src={contactImg} alt="Contact" className="img-fluid mt-4" style={{ maxWidth: "250px" }} />
          </div>

          {/* Connect Us Form */}
          <div className="card shadow p-4 w-100" style={{ maxWidth: "500px", backgroundColor: "white", color: "#212529" }}>
            <h5 className="text-success mb-3">📬 Connect With Creator</h5>
            <form action="https://formspree.io/f/manbjgpz" method="POST">
              <div className="mb-3">
                <label>Name</label>
                <input name="name" className="form-control" required />
              </div>
              <div className="mb-3">
                <label>Mobile Number</label>
                <input name="number" type="tel" className="form-control" required />
              </div>
              <div className="mb-3">
                <label>Message</label>
                <textarea name="message" className="form-control" rows="3" required />
              </div>

              {/* Hidden options for FormSubmit */}
              <input type="hidden" name="_captcha" value="false" />
              <input type="hidden" name="_template" value="box" />
              <input type="hidden" name="_autoresponse" value="Thanks for reaching out! Tanisha will contact you shortly." />

              <button className="btn btn-success w-100">Send</button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
