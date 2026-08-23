import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import WizardShell from "./WizardShell";
import { TextField, TextAreaField, SelectField, RadioGroup, FileDrop } from "./Field";

const empty = {
  fullName: "", father: "", mother: "", dob: "", gender: "", caste: "", category: "",religion: "",nationality: "",
  maritalstatus: "",mobile: "",emergencycontact: "", email: "", aadhaar: "", pan: "", currentAddress: "", permanentAddress: "",
  subject: "", classGrade: "", experience: "", prevSchool: "", designation: "", duration: "",
  monthlysalary: "", joiningdate: "", profile: "",
  ssc: "", hsc: "", grad: "", pg: "", bed: "", certifications: "", computerSkill: "", software: "",
  ctet: "", tet: "",
  photo: "", idProof: "", pan_doc: "", signature: "", resume: "", addressProof: "",
  sscDoc: "", hscDoc: "", degreeDoc: "", pgDoc: "", bedDoc: "", tetDoc: "", casteDoc: "", domicileDoc: "",
};

export default function TeacherRegistration() {
  const { showToast } = useOutletContext();
  const [step, setStep] = useState(1);
  const [f, setF] = useState(empty);
  const [submitted, setSubmitted] = useState(false);
  const set = (k) => (v) => setF((s) => ({ ...s, [k]: v }));

  if (submitted) {
    return (
      <div className="reg-wrap">
        <div className="coming-soon">
          <i className="bi bi-check-circle"></i>
          <h2 style={{ color: "var(--text-primary)", marginBottom: 8 }}>Application submitted</h2>
          <p>Thank you, {f.fullName || "applicant"}. Your teacher registration form has been received. Our admissions team will contact you at {f.mobile || "the number provided"}.</p>
          <button className="btn-purple" style={{ marginTop: 16 }} onClick={() => { setF(empty); setStep(1); setSubmitted(false); }}>
            Submit another application
          </button>
        </div>
      </div>
    );
  }

  if (step === 1) {
    return (
      <WizardShell
        icon="bi bi-person-fill"
        stepLabel="Step 1 of 4 — Basic Information"
        description="Please fill in your personal details accurately as per official documents."
        totalSteps={4}
        currentStep={1}
        instructions="Fields marked with * are mandatory. Use capital letters for name fields. Aadhaar number should match your Aadhaar card."
        onNext={() => setStep(2)}
      >
        <h3 className="section-title">Personal Details</h3><hr />
        <TextField label="Full Name (as per Aadhaar)" required value={f.fullName} onChange={set("fullName")} placeholder="Enter full name in CAPITAL LETTERS" />
        <div className="row-flex">
          <div className="col-flex"><TextField label="Father's Name" required value={f.father} onChange={set("father")} placeholder="Enter father's full name" /></div>
          <div className="col-flex"><TextField label="Mother's Name" required value={f.mother} onChange={set("mother")} placeholder="Enter mother's full name" /></div>
        </div>
        <div className="row-flex">
          <div className="col-flex"><TextField label="Date of Birth" required type="date" value={f.dob} onChange={set("dob")} /></div>
          <div className="col-flex"><RadioGroup label="Gender" required name="gender" value={f.gender} onChange={set("gender")} options={["Male", "Female", "Other"]} /></div>
        </div>
        <div className="row-flex">
          <div className="col-flex"><TextField label="Caste" required value={f.caste} onChange={set("caste")} placeholder="Enter caste" /></div>
          <div className="col-flex"><SelectField label="Category" required value={f.category} onChange={set("category")} options={["General", "OBC", "SC", "ST", "EWS"]} /></div>
        </div>
         <div className="row-flex">
          <div className="col-flex"><TextField label="Religion" required value={f.religion} onChange={set("religion")} /></div>
          <div className="col-flex"><TextField label="Nationality" required value={f.nationality} onChange={set("nationality")} /></div>
        </div>
        <div className="row-flex">
          <div className="col-flex"><SelectField label="Marital Status" required value={f.marital} onChange={set("marital")} options={["Single", "Married"]} /></div>
          <div className="col-flex"><TextField label="Email ID" type="email" required value={f.email} onChange={set("email")} /></div>
        </div>

        <h3 className="section-title">Contact Details</h3><hr />
        <div className="row-flex">
          <div className="col-flex"><TextField label="Mobile Number" required value={f.mobile} onChange={set("mobile")} placeholder="10-digit mobile number" /></div>
          <div className="col-flex"><TextField label="Emergency Contact" required type="emergencycontact" value={f.emergencycontact} onChange={set("emergencycontact")}  /></div>
        </div>

        <h3 className="section-title">Identity Details</h3><hr />
        <div className="row-flex">
          <div className="col-flex"><TextField label="Aadhaar Number" required value={f.aadhaar} onChange={set("aadhaar")} placeholder="XXXX XXXX XXXX" /></div>
          <div className="col-flex"><TextField label="PAN Number" required value={f.pan} onChange={set("pan")} placeholder="ABCDE1234F" /></div>
        </div>

        <h3 className="section-title">Address Details</h3><hr />
        <TextAreaField label="Current / Correspondence Address" required value={f.currentAddress} onChange={set("currentAddress")} />
        <TextAreaField label="Permanent Address" required value={f.permanentAddress} onChange={set("permanentAddress")} />
      </WizardShell>
    );
  }

  if (step === 2) {
    return (
      <WizardShell
        icon="bi bi-briefcase-fill"
        stepLabel="Step 2 of 4 — Professional Details"
        description="Provide details about your teaching preferences and current employment."
        totalSteps={4}
        currentStep={2}
        instructions="You may select subjects and classes you'd like to teach. Salary expectation should be in Indian Rupees (₹) per month."
        onBack={() => setStep(1)}
        onNext={() => setStep(3)}
      >
        <h3 className="section-title">Teaching Preference</h3><hr />
        <div className="row-flex">
          <div className="col-flex"><SelectField label="Applying for Subject" required value={f.subject} onChange={set("subject")} options={["Mathematics", "Science", "English", "History", "Geography", "Computer Science"]} /></div>
          <div className="col-flex"><SelectField label="Applying for Class / Grade" required value={f.classGrade} onChange={set("classGrade")} options={["Nursery / KG (Pre-Primary)", "Class 1 to 4 (Primary)", "Class 5 to 7 (Upper Primary)", "Class 8 to 10 (Secondary)"]} /></div>
        </div>

        <h3 className="section-title">Work Experience</h3><hr />
        <div className="row-flex">
          <div className="col-flex"><SelectField label="Total Years of Teaching Experience" required value={f.experience} onChange={set("experience")} options={["Fresher (0 years)", "Less than 1 year", "1-2 years", "3-5 years", "5+ years"]} /></div>
          <div className="col-flex"><TextField label="Previous School / Organisation (if any)" value={f.prevSchool} onChange={set("prevSchool")} placeholder="School / organisation name" /></div>
        </div>
        <div className="row-flex">
          <div className="col-flex"><TextField label="Designation at Previous Institution" value={f.designation} onChange={set("designation")} placeholder="e.g. Assistant Teacher" /></div>
          <div className="col-flex"><TextField label="Duration at Previous Institution" value={f.duration} onChange={set("duration")} placeholder="e.g. 2 years" /></div>
        </div>

        <h3 className="section-title">Salary &amp; Availability</h3><hr />
        <div className="row-flex">
          <div className="col-flex"><TextField label="Monthly Salary (₹)" required value={f.monthlysalary} onChange={set("monthlysalary")} placeholder="e.g. 30000" /></div>
          <div className="col-flex"><TextField label="Joining Date" type="date" value={f.joiningdate} onChange={set("joiningdate")} /></div>
        </div>

        <h3 className="section-title">Additional Information</h3><hr />
        <TextAreaField label="Brief Profile / About Yourself" value={f.profile} onChange={set("profile")} placeholder="Tell us a little about your teaching approach…" />
      </WizardShell>
    );
  }

  if (step === 3) {
    const divisions = ["Distinction", "First", "Second", "Third", "Pass"];
    return (
      <WizardShell
        icon="bi bi-journal-bookmark-fill"
        stepLabel="Step 3 of 4 — Qualification & Skills"
        description="Provide your academic qualifications, certifications, and skills in detail."
        totalSteps={4}
        currentStep={3}
        instructions="Please fill in all relevant qualifications. Enter percentage/CGPA as obtained. Upload supporting documents on the next page."
        onBack={() => setStep(2)}
        onNext={() => setStep(4)}
      >
        <h3 className="section-title">1. Educational Qualification</h3><hr />
        <div className="qual-table-head">
          <div>Examination</div><div>Board / University</div><div>Year of Passing</div><div>Percentage / CGPA</div><div>Division</div>
        </div>
        {[
          ["ssc", "SSC / 10th"],
          ["hsc", "HSC / 12th"],
          ["grad", "Graduation (B.A/B.Sc/B.Com)"],
          ["pg", "Post-Graduation (M.A/M.Sc)"],
          ["bed", "B.Ed / D.Ed"],
        ].map(([key, label]) => (
          <div className="qual-row" key={key}>
            <div><label>{label}</label></div>
            <div><input placeholder="Board name" value={f[key + "Board"] || ""} onChange={(e) => setF((s) => ({ ...s, [key + "Board"]: e.target.value }))} /></div>
            <div><input placeholder="e.g. 2020" value={f[key + "Year"] || ""} onChange={(e) => setF((s) => ({ ...s, [key + "Year"]: e.target.value }))} /></div>
            <div><input placeholder="e.g. 85.6%" value={f[key + "Pct"] || ""} onChange={(e) => setF((s) => ({ ...s, [key + "Pct"]: e.target.value }))} /></div>
            <div>
              <select value={f[key + "Div"] || ""} onChange={(e) => setF((s) => ({ ...s, [key + "Div"]: e.target.value }))}>
                <option value="">Select</option>
                {divisions.map((d) => <option key={d}>{d}</option>)}
              </select>
            </div>
          </div>
        ))}

        <h3 className="section-title">2. Skills &amp; Certifications</h3><hr />
        <TextAreaField label="Professional Certifications / Awards" required value={f.certifications} onChange={set("certifications")} placeholder="List certifications, awards or achievements" />

        <h3 className="section-title">3. Computer Skills</h3><hr />
        <div className="row-flex">
          <div className="col-flex"><SelectField label="Overall Computer Proficiency" required value={f.computerSkill} onChange={set("computerSkill")} options={["Basic", "Intermediate", "Advanced"]} /></div>
          <div className="col-flex"><TextField label="Software Known" value={f.software} onChange={set("software")} placeholder="e.g. MS Office, Google Classroom" /></div>
        </div>

        <h3 className="section-title">4. Teaching Certificates</h3><hr />
        <div className="row-flex">
          <div className="col-flex"><SelectField label="CTET Status" value={f.ctet} onChange={set("ctet")} options={["Qualified", "Not Qualified", "Not Applicable"]} /></div>
          <div className="col-flex"><SelectField label="State TET Status" value={f.tet} onChange={set("tet")} options={["Qualified", "Not Qualified", "Not Applicable"]} /></div>
        </div>
      </WizardShell>
    );
  }

  // step 4
  return (
    <WizardShell
      icon="bi bi-file-earmark-arrow-up-fill"
      stepLabel="Step 4 of 4 — Document Upload"
      description="Upload scanned copies of all required documents in JPG, PNG or PDF format."
      totalSteps={4}
      currentStep={4}
      instructions="Documents marked Required must be uploaded to proceed. Max 500 KB per document. Accepted formats: JPG, PNG, PDF."
      onBack={() => setStep(3)}
      onNext={() => { setSubmitted(true); showToast("Teacher application submitted", "ti-check"); }}
      nextLabel="Submit Application"
    >
      <h3 className="section-title">Identity &amp; Photo Documents</h3><hr />
      <div className="row-flex">
        <div className="col-flex"><FileDrop label="Passport Size Photograph" required hint="White background · Max 200 KB · JPG/PNG" fileName={f.photo} onChange={set("photo")} /></div>
        <div className="col-flex"><FileDrop label="ID Proof" required hint="Front & back side clearly visible" fileName={f.idProof} onChange={set("idProof")} /></div>
      </div>
      <div className="row-flex">
        <div className="col-flex"><FileDrop label="Signature" required hint="On plain white background" fileName={f.signature} onChange={set("signature")} /></div>
        <div className="col-flex"><FileDrop label="PAN Card" hint="Optional" fileName={f.pan_doc} onChange={set("pan_doc")} /></div>
      </div>

      <h3 className="section-title">Professional Documents</h3><hr />
      <div className="row-flex">
        <div className="col-flex"><FileDrop label="Resume / CV" required hint="PDF preferred" fileName={f.resume} onChange={set("resume")} /></div>
        <div className="col-flex"><FileDrop label="Address Proof" hint="Utility bill / rent agreement" fileName={f.addressProof} onChange={set("addressProof")} /></div>
      </div>

      <h3 className="section-title">Academic Certificates &amp; Marksheets</h3><hr />
      <div className="row-flex">
        <div className="col-flex"><FileDrop label="10th (SSC) Marksheet" required hint="Scanned copy" fileName={f.sscDoc} onChange={set("sscDoc")} /></div>
        <div className="col-flex"><FileDrop label="12th (HSC) Marksheet" required hint="Scanned copy" fileName={f.hscDoc} onChange={set("hscDoc")} /></div>
      </div>
      <div className="row-flex">
        <div className="col-flex"><FileDrop label="Degree Certificate (Graduation)" required hint="Scanned copy" fileName={f.degreeDoc} onChange={set("degreeDoc")} /></div>
        <div className="col-flex"><FileDrop label="PG Certificate / Marksheet" hint="If applicable" fileName={f.pgDoc} onChange={set("pgDoc")} /></div>
      </div>

      <h3 className="section-title">Teaching Qualification Certificates</h3><hr />
      <div className="row-flex">
        <div className="col-flex"><FileDrop label="B.Ed / D.Ed Certificate" required hint="Scanned copy" fileName={f.bedDoc} onChange={set("bedDoc")} /></div>
        <div className="col-flex"><FileDrop label="CTET / State TET Certificate" hint="If applicable" fileName={f.tetDoc} onChange={set("tetDoc")} /></div>
      </div>

      <h3 className="section-title">Other Certificates</h3><hr />
      <div className="row-flex">
        <div className="col-flex"><FileDrop label="Caste Certificate" required hint="If applicable" fileName={f.casteDoc} onChange={set("casteDoc")} /></div>
        <div className="col-flex"><FileDrop label="Domicile Certificate" required hint="Proof of residence" fileName={f.domicileDoc} onChange={set("domicileDoc")} /></div>
      </div>
    </WizardShell>
  );
}
