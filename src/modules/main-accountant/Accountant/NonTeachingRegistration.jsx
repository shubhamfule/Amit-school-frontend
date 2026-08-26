import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import WizardShell from "./WizardShell";
import { TextField, TextAreaField, SelectField, RadioGroup, FileDrop } from "./Field";
import { apiPost } from "../../teacher/utils/api";

const empty = {
  fullName: "", father: "", mother: "", dob: "", gender: "", caste: "", category: "", marital: "", email: "",
  mobile: "", emergency: "", aadhaar: "", pan: "", currentAddress: "", permanentAddress: "",
  empType: "", department: "", workExp: "", shift: "", prevOrg: "", salaryExpect: "", availableToJoin: "", profile: "",
  qualification: "", skills: "",
  photo: "", signature: "", aadhaarDoc: "", eduDoc: "", license: "", expCert: "", casteDoc: "", domicileDoc: "",
};

export default function NonTeachingRegistration() {
  const { showToast } = useOutletContext();
  const [step, setStep] = useState(1);
  const [f, setF] = useState(empty);
  const [submitted, setSubmitted] = useState(false);
  const set = (k) => (v) => setF((s) => ({ ...s, [k]: v }));

  const submitApplication = async () => {
    try {
      await apiPost("/non-teaching-onboarding", {
        staffId: `APP-NT-${Date.now()}`,
        fullName: f.fullName,
        father: f.father,
        mother: f.mother,
        dob: f.dob,
        gender: f.gender,
        caste: f.caste,
        category: f.category,
        maritalStatus: f.marital,
        email: f.email,
        mobile: f.mobile,
        emergencyContact: f.emergency,
        aadhaar: f.aadhaar,
        pan: f.pan,
        currentAddress: f.currentAddress,
        permanentAddress: f.permanentAddress,
        empType: f.empType,
        department: f.department,
        workExp: f.workExp,
        shift: f.shift,
        prevOrg: f.prevOrg,
        salaryExpect: f.salaryExpect,
        availableToJoin: f.availableToJoin || undefined,
        profile: f.profile,
        qualification: f.qualification,
        skills: f.skills,
        documents: {
          photo: f.photo, signature: f.signature, aadhaarDoc: f.aadhaarDoc, eduDoc: f.eduDoc,
          license: f.license, expCert: f.expCert, casteDoc: f.casteDoc, domicileDoc: f.domicileDoc,
        },
      });
      setSubmitted(true);
      showToast("Non-teaching application submitted", "ti-check");
    } catch (err) {
      showToast(err.message || "Could not submit application", "ti-alert-triangle");
    }
  };

  if (submitted) {
    return (
      <div className="reg-wrap">
        <div className="coming-soon">
          <i className="bi bi-check-circle"></i>
          <h2 style={{ color: "var(--text-primary)", marginBottom: 8 }}>Application submitted</h2>
          <p>Thank you, {f.fullName || "applicant"}. Your non-teaching staff registration has been received.</p>
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
        stepLabel="Step 1 of 3 — Basic Information"
        description="Please fill in your personal details accurately as per official documents."
        totalSteps={3}
        currentStep={1}
        instructions="Fields marked with * are mandatory. Use capital letters for name fields."
        onNext={() => setStep(2)}
      >
        <h3 className="section-title">Personal Details</h3><hr />
        <TextField label="Full Name (as per Aadhaar)" required value={f.fullName} onChange={set("fullName")} placeholder="Enter full name in CAPITAL LETTERS" />
        <div className="row-flex">
          <div className="col-flex"><TextField label="Father's Name" required value={f.father} onChange={set("father")} /></div>
          <div className="col-flex"><TextField label="Mother's Name" required value={f.mother} onChange={set("mother")} /></div>
        </div>
        <div className="row-flex">
          <div className="col-flex"><TextField label="Date of Birth" required type="date" value={f.dob} onChange={set("dob")} /></div>
          <div className="col-flex"><RadioGroup label="Gender" required name="gender" value={f.gender} onChange={set("gender")} options={["Male", "Female", "Other"]} /></div>
        </div>
        <div className="row-flex">
          <div className="col-flex"><TextField label="Caste" required value={f.caste} onChange={set("caste")} /></div>
          <div className="col-flex"><SelectField label="Category" required value={f.category} onChange={set("category")} options={["General", "OBC", "SC", "ST", "EWS"]} /></div>
        </div>
        <div className="row-flex">
          <div className="col-flex"><SelectField label="Marital Status" required value={f.marital} onChange={set("marital")} options={["Single", "Married"]} /></div>
          <div className="col-flex"><TextField label="Email ID" type="email" value={f.email} onChange={set("email")} /></div>
        </div>

        <h3 className="section-title">Contact Details</h3><hr />
        <div className="row-flex">
          <div className="col-flex"><TextField label="Mobile Number" required value={f.mobile} onChange={set("mobile")} placeholder="10-digit mobile number" /></div>
          <div className="col-flex"><TextField label="Emergency Contact" required value={f.emergency} onChange={set("emergency")} /></div>
        </div>

        <h3 className="section-title">Identity Details</h3><hr />
        <div className="row-flex">
          <div className="col-flex"><TextField label="Aadhaar Number" required value={f.aadhaar} onChange={set("aadhaar")} /></div>
          <div className="col-flex"><TextField label="PAN Number" required value={f.pan} onChange={set("pan")} /></div>
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
        stepLabel="Step 2 of 3 — Professional Details"
        description="Provide details about the role you're applying for."
        totalSteps={3}
        currentStep={2}
        instructions="Salary expectation should be in Indian Rupees (₹) per month."
        onBack={() => setStep(1)}
        onNext={() => setStep(3)}
      >
        <h3 className="section-title">Job Details</h3><hr />
        <div className="row-flex">
          <div className="col-flex"><SelectField label="Employee Type" required value={f.empType} onChange={set("empType")} options={["Non-Teaching"]} /></div>
          <div className="col-flex"><SelectField label="Department" required value={f.department} onChange={set("department")} options={["Administration", "Accounts", "Office", "Transport", "Library", "Security"]} /></div>
        </div>

        <h3 className="section-title">Work Experience / Shift</h3><hr />
        <div className="row-flex">
          <div className="col-flex"><SelectField label="Work Experience" required value={f.workExp} onChange={set("workExp")} options={["Fresher (0 years)", "Less than 1 year", "1-2 years", "3-5 years", "5+ years"]} /></div>
          <div className="col-flex"><SelectField label="Shift" required value={f.shift} onChange={set("shift")} options={["Day Shift", "Night Shift", "Rotational"]} /></div>
        </div>
        <TextField label="Previous School / Organisation (if any)" value={f.prevOrg} onChange={set("prevOrg")} />

        <h3 className="section-title">Salary &amp; Availability</h3><hr />
        <div className="row-flex">
          <div className="col-flex"><TextField label="Expected Monthly Salary (₹)" required value={f.salaryExpect} onChange={set("salaryExpect")} placeholder="e.g. 16000" /></div>
          <div className="col-flex"><TextField label="Available to Join" type="date" value={f.availableToJoin} onChange={set("availableToJoin")} /></div>
        </div>

        <h3 className="section-title">Additional Information</h3><hr />
        <TextAreaField label="Brief Profile / About Yourself" value={f.profile} onChange={set("profile")} />
      </WizardShell>
    );
  }

  return (
    <WizardShell
      icon="bi bi-file-earmark-arrow-up-fill"
      stepLabel="Step 3 of 3 — Document Upload"
      description="Upload scanned copies of all required documents in JPG, PNG or PDF format."
      totalSteps={3}
      currentStep={3}
      instructions="Documents marked Required must be uploaded to proceed. Max 500 KB per document."
      onBack={() => setStep(2)}
      onNext={submitApplication}
      nextLabel="Submit Application"
    >
      <h3 className="section-title">Educational Detail</h3><hr />
      <div className="row-flex">
        <div className="col-flex"><SelectField label="Highest Qualification" required value={f.qualification} onChange={set("qualification")} options={["Below 10th", "10th Pass", "12th Pass", "Graduate", "Post Graduate"]} /></div>
        <div className="col-flex"><TextField label="Relevant Skills" required value={f.skills} onChange={set("skills")} placeholder="e.g. Driving, First Aid" /></div>
      </div>

      <h3 className="section-title">Documents Upload</h3><hr />
      <div className="row-flex">
        <div className="col-flex"><FileDrop label="Passport Size Photo" required hint="White background · Max 200 KB" fileName={f.photo} onChange={set("photo")} /></div>
        <div className="col-flex"><FileDrop label="Signature" required hint="On plain white background" fileName={f.signature} onChange={set("signature")} /></div>
      </div>
      <div className="row-flex">
        <div className="col-flex"><FileDrop label="Aadhar Card" required hint="Front & back visible" fileName={f.aadhaarDoc} onChange={set("aadhaarDoc")} /></div>
        <div className="col-flex"><FileDrop label="Educational Certificate" hint="Highest qualification proof" fileName={f.eduDoc} onChange={set("eduDoc")} /></div>
      </div>
      <div className="row-flex">
        <div className="col-flex"><FileDrop label="Driving License" hint="If applicable (drivers)" fileName={f.license} onChange={set("license")} /></div>
        <div className="col-flex"><FileDrop label="Experience Certificate" hint="From previous employer" fileName={f.expCert} onChange={set("expCert")} /></div>
      </div>
      <div className="row-flex">
        <div className="col-flex"><FileDrop label="Caste Certificate" required hint="If applicable" fileName={f.casteDoc} onChange={set("casteDoc")} /></div>
        <div className="col-flex"><FileDrop label="Domicile Certificate" required hint="Proof of residence" fileName={f.domicileDoc} onChange={set("domicileDoc")} /></div>
      </div>
    </WizardShell>
  );
}
