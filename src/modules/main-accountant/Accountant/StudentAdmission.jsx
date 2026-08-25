import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import WizardShell from "./WizardShell";
import { TextField, TextAreaField, SelectField, RadioGroup, FileDrop } from "./Field";
import FeeReceipt from "./FeeReceipt";
import { apiPost } from "../../teacher/utils/api";

const empty = {
  firstName: "", lastName: "", session: "2026-2027", prevSchool: "", prevClass: "", aadhaar: "",
  enteringClass: "", bloodGroup: "", city: "", nationality: "Indian", dob: "", gender: "", caste: "", category: "", religion: "",
  father: "", mother: "", fatherOcc: "", motherOcc: "", fatherEdu: "", motherEdu: "",
  guardian: "", guardianOcc: "", guardianEdu: "", guardianRelation: "",
  mobile: "", email: "", currentAddress: "", permanentAddress: "",
  photo: "", birthCert: "", tc: "", marksheet: "", addressProof: "", signature: "", aadhaarDoc: "", casteDoc: "", domicileDoc: "",
};

// Only the fields that exist on the backend Student schema (Backend/src/module/Admin.js)
// are sent — the wizard collects a fuller admission profile (aadhaar, religion,
// documents, etc.) than that schema stores.
function toStudentPayload(f) {
  return {
    name: `${f.firstName} ${f.lastName}`.trim(),
    class: f.enteringClass,
    dob: f.dob || undefined,
    gender: f.gender || undefined,
    father: f.father,
    mother: f.mother,
    contact: f.mobile,
    address: f.currentAddress,
    academicYear: f.session,
  };
}

export default function StudentAdmission() {
  const { showToast } = useOutletContext();
  const [step, setStep] = useState(1);
  const [f, setF] = useState(empty);
  const [submitting, setSubmitting] = useState(false);
  const set = (k) => (v) => setF((s) => ({ ...s, [k]: v }));

  const handlePaid = async () => {
    setSubmitting(true);
    try {
      await apiPost("/students", toStudentPayload(f));
      showToast("Admission fee payment recorded", "ti-check");
      return true;
    } catch (err) {
      showToast(err.message || "Failed to save student", "ti-alert");
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  if (step === 4) {
    return (
      <FeeReceipt
        studentName={`${f.firstName} ${f.lastName}`.trim() || "New Student"}
        onBack={() => setStep(3)}
        onPaid={handlePaid}
        paying={submitting}
      />
    );
  }

  if (step === 1) {
    return (
      <WizardShell
        icon="bi bi-mortarboard-fill"
        stepLabel="Step 1 of 3 — Student Information"
        description="Please fill in the student's personal details accurately as per official documents."
        totalSteps={3}
        currentStep={1}
        instructions="Fields marked with * are mandatory. Use capital letters for name fields."
        onNext={() => setStep(2)}
      >
        <h3 className="section-title">Personal Details</h3><hr />
        <div className="row-flex">
          <div className="col-flex"><TextField label="First Name" required value={f.firstName} onChange={set("firstName")} /></div>
          <div className="col-flex"><TextField label="Last Name" required value={f.lastName} onChange={set("lastName")} /></div>
        </div>
        <div className="row-flex">
          <div className="col-flex"><TextField label="Academic Session" required value={f.session} onChange={set("session")} /></div>
          <div className="col-flex"><SelectField label="Entering Class" required value={f.enteringClass} onChange={set("enteringClass")} options={["Nursery", "KG", "1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th", "10th"]} /></div>
        </div>
        <div className="row-flex">
          <div className="col-flex"><TextField label="Previous School" value={f.prevSchool} onChange={set("prevSchool")} /></div>
          <div className="col-flex"><TextField label="Previous Class" value={f.prevClass} onChange={set("prevClass")} /></div>
        </div>
        <div className="row-flex">
          <div className="col-flex"><TextField label="Aadhar Number" required value={f.aadhaar} onChange={set("aadhaar")} /></div>
          <div className="col-flex"><SelectField label="Blood Group" value={f.bloodGroup} onChange={set("bloodGroup")} options={["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]} /></div>
        </div>
        <div className="row-flex">
          <div className="col-flex"><TextField label="City" required value={f.city} onChange={set("city")} /></div>
          <div className="col-flex"><TextField label="Nationality" required value={f.nationality} onChange={set("nationality")} /></div>
        </div>
        <div className="row-flex">
          <div className="col-flex"><TextField label="Date of Birth" required type="date" value={f.dob} onChange={set("dob")} /></div>
          <div className="col-flex"><RadioGroup label="Gender" required name="gender" value={f.gender} onChange={set("gender")} options={["Male", "Female", "Other"]} /></div>
        </div>
        <div className="row-flex">
          <div className="col-flex"><TextField label="Caste" required value={f.caste} onChange={set("caste")} /></div>
          <div className="col-flex"><SelectField label="Category" required value={f.category} onChange={set("category")} options={["General", "OBC", "SC", "ST", "EWS"]} /></div>
        </div>
        <SelectField label="Religion" required value={f.religion} onChange={set("religion")} options={["Hindu", "Muslim", "Christian", "Sikh", "Buddhist", "Jain", "Other"]} />
      </WizardShell>
    );
  }

  if (step === 2) {
    return (
      <WizardShell
        icon="bi bi-people-fill"
        stepLabel="Step 2 of 3 — Parents Information"
        description="Provide parent / guardian details and contact information."
        totalSteps={3}
        currentStep={2}
        instructions="Guardian fields are optional and only required if applicable."
        onBack={() => setStep(1)}
        onNext={() => setStep(3)}
      >
        <h3 className="section-title">Parents Details</h3><hr />
        <div className="row-flex">
          <div className="col-flex"><TextField label="Father's Name" required value={f.father} onChange={set("father")} /></div>
          <div className="col-flex"><TextField label="Mother's Name" required value={f.mother} onChange={set("mother")} /></div>
        </div>
        <div className="row-flex">
          <div className="col-flex"><TextField label="Father's Occupation" required value={f.fatherOcc} onChange={set("fatherOcc")} /></div>
          <div className="col-flex"><TextField label="Mother's Occupation" required value={f.motherOcc} onChange={set("motherOcc")} /></div>
        </div>
        <div className="row-flex">
          <div className="col-flex"><TextField label="Father's Education" required value={f.fatherEdu} onChange={set("fatherEdu")} /></div>
          <div className="col-flex"><TextField label="Mother's Education" required value={f.motherEdu} onChange={set("motherEdu")} /></div>
        </div>
        <div className="row-flex">
          <div className="col-flex"><TextField label="Guardian Name" value={f.guardian} onChange={set("guardian")} /></div>
          <div className="col-flex"><TextField label="Guardian Occupation" value={f.guardianOcc} onChange={set("guardianOcc")} /></div>
        </div>
        <div className="row-flex">
          <div className="col-flex"><TextField label="Guardian Education" value={f.guardianEdu} onChange={set("guardianEdu")} /></div>
          <div className="col-flex"><TextField label="Guardian Relation" value={f.guardianRelation} onChange={set("guardianRelation")} /></div>
        </div>

        <h3 className="section-title">Contact Details</h3><hr />
        <div className="row-flex">
          <div className="col-flex"><TextField label="Mobile Number" required value={f.mobile} onChange={set("mobile")} /></div>
          <div className="col-flex"><TextField label="Email" type="email" value={f.email} onChange={set("email")} /></div>
        </div>

        <h3 className="section-title">Address Details</h3><hr />
        <TextAreaField label="Current / Correspondence Address" required value={f.currentAddress} onChange={set("currentAddress")} />
        <TextAreaField label="Permanent Address" required value={f.permanentAddress} onChange={set("permanentAddress")} />
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
      instructions="Documents marked Required must be uploaded to proceed."
      onBack={() => setStep(2)}
      onNext={() => setStep(4)}
      nextLabel="Continue to Fee Payment"
    >
      <h3 className="section-title">Identity &amp; Photo Documents</h3><hr />
      <div className="row-flex">
        <div className="col-flex"><FileDrop label="Student Passport Size Photo" required hint="White background · Max 200 KB" fileName={f.photo} onChange={set("photo")} /></div>
        <div className="col-flex"><FileDrop label="Birth Certificate" required hint="Scanned copy" fileName={f.birthCert} onChange={set("birthCert")} /></div>
      </div>
      <div className="row-flex">
        <div className="col-flex"><FileDrop label="Transfer Certificate (TC)" hint="If applicable" fileName={f.tc} onChange={set("tc")} /></div>
        <div className="col-flex"><FileDrop label="Marksheet" hint="Previous class marksheet" fileName={f.marksheet} onChange={set("marksheet")} /></div>
      </div>
      <div className="row-flex">
        <div className="col-flex"><FileDrop label="Address Proof" required hint="Utility bill / rent agreement" fileName={f.addressProof} onChange={set("addressProof")} /></div>
        <div className="col-flex"><FileDrop label="Signature" hint="Parent/guardian signature" fileName={f.signature} onChange={set("signature")} /></div>
      </div>
      <FileDrop label="Aadhar Card" required hint="Front & back visible" fileName={f.aadhaarDoc} onChange={set("aadhaarDoc")} />

      <h3 className="section-title">Other Certificates</h3><hr />
      <div className="row-flex">
        <div className="col-flex"><FileDrop label="Caste Certificate" required hint="If applicable" fileName={f.casteDoc} onChange={set("casteDoc")} /></div>
        <div className="col-flex"><FileDrop label="Domicile Certificate" required hint="Proof of residence" fileName={f.domicileDoc} onChange={set("domicileDoc")} /></div>
      </div>
    </WizardShell>
  );
}
