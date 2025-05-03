import { useState } from "react";
import { Patient } from "../types/patient";
import { namePrefixes, genders, bloodGroups, indianStates, countries, contactMethods, maritalStatuses, relationships } from "../types/options";
import { createPatient } from "../apis/patientApi";
import { toast } from "react-toastify";
import { FaPlus, FaTrashAlt } from 'react-icons/fa';
import { Link } from "react-router-dom";


const MainContent = () => {
    const getCurrentDate = () => {
        const now = new Date();
        return now.toISOString().split("T")[0];
    };

    const getCurrentTime = () => {
        const now = new Date();
        return now.toTimeString().split(":").slice(0, 2).join(":");
    };

    const emptyPatient: Patient = {
        firstName: '',
        lastName: '',
        birthDate: '',
        mobilePhone: '',
        middleName: '',
        namePrefix: '',
        nameSuffix: '',
        preferredName: '',
        genderIdentity: '',
        gender: '',
        preferredPronouns: '',
        childrenCount: '',
        bloodGroup: '',
        maritalStatus: '',
        email: '',
        phone: '',
        emergencyName: '',
        emergencyRelation: '',
        emergencyPhone: '',
        chiefComplaint: '',
        consultantName: '',
        department: '',
        dateOfVisit: getCurrentDate(),
        timeOfVisit: getCurrentTime(),
        appointmentType: '',
        referredBy: '',
        comments: '',
        preferredContactMethod: '',
        appointmentReminders: false,
        preferedLanguage: '',
        interpreterRequired: '',
        ethnicity: '',
        race: '',
        organDonor: false,
        livingWill: false,
        powerOfAttorney: false,
        addresses: [
            {
                line1: '',
                line2: '',
                city: '',
                state: '',
                postCode: '',
                country: ''
            }
        ],
        phones: [{ countryCode: '', type: 'Mobile', number: '' }],
        identifiers: [
            { type: 'ABHA', value: '' },
            { type: 'MRN', value: '' },
        ],
        relationships: [],
        emergencyContacts: [
            {
                emergencyName: '',
                emergencyRelation: '',
                emergencyPhone: ''
            }
        ],
    };

    const [form, setForm] = useState<Patient>(emptyPatient);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const identifierTypes = ['Aadhar Card', 'PAN Card', 'Driving License'];

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value, type } = e.target;
        const checked = type === 'checkbox' && (e.target as HTMLInputElement).checked;
        setForm(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleArrayChange = (
        index: number,
        field: string,
        value: string,
        arrayType: 'addresses' | 'phones' | 'identifiers' | 'relationships' | 'emergencyContacts') => {
        setForm(prev => {
            const updatedArray = [...(prev[arrayType] || [])];
            updatedArray[index] = { ...updatedArray[index], [field]: value };
            return { ...prev, [arrayType]: updatedArray };
        });
    };

    const addArrayEntry = (arrayType: 'addresses' | 'phones' | 'identifiers' | 'relationships' | 'emergencyContacts') => {
        setForm(prev => ({
            ...prev,
            [arrayType]: [
                ...(prev[arrayType] || []),
                arrayType === 'addresses' ? { line1: '', city: '', state: '', postCode: '', country: '' } :
                    arrayType === 'phones' ? { type: '', number: '' } :
                        arrayType === 'identifiers' ? { type: '', value: '' } :
                            arrayType === 'relationships' ? { relationType: '', relationName: '', relationMobile: '' } :
                                { emergencyName: '', emergencyRelation: '', emergencyPhone: '' }
            ],
        }));
    };

    const removeArrayEntry = (index: number, arrayType: 'addresses' | 'phones' | 'identifiers' | 'emergencyContacts') => {
        setForm(prev => ({
            ...prev,
            [arrayType]: (prev[arrayType] || []).filter((_, i) => i !== index),
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!validate()) {
            toast.error("Please fix the errors in the form.");
            return;
        }

        try {
            const data = await createPatient(form);

            if (data) {
                toast.success("Patient created successfully!");
                setForm(emptyPatient);
            }
        } catch (error: any) {
            if (error.response && error.response.status === 409) {
                const field = error.response.data.field || 'ABHA or Email or MRN';
                toast.error(`Conflict: A patient with this ${field} already exists.`);
            } else {
                toast.error("Failed to create patient. Please try again.");
            }
            console.error("Submit error:", error);
        }
    };

    const validate = () => {
        const tempErrors: { [key: string]: string } = {};
        if (!form.firstName) {
            tempErrors.firstName = "First Name is required";
        } else if (!/^[A-Za-z\s]+$/.test(form.firstName)) {
            tempErrors.firstName = "First Name must contain only letters and spaces";
        }
        if (!form.lastName) {
            tempErrors.lastName = "Last Name is required";
        } else if (!/^[A-Za-z\s]+$/.test(form.lastName)) {
            tempErrors.lastName = "Last Name must contain only letters and spaces";
        }
        if (!form.birthDate) {
            tempErrors.birthDate = "Birth Date is required";
        } else {
            const today = new Date().toISOString().split("T")[0];
            if (form.birthDate >= today) {
                tempErrors.birthDate = "Birth Date must be in the past";
            }
        }
        if (!form.email) {
            tempErrors.email = "Email is required";
        } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(form.email)) {
            tempErrors.email = "Please enter a valid email address";
        }

        const address = (form.addresses ?? [])[0];
        if (!address?.line1) tempErrors["address.line1"] = "House/Flat No. is required";
        if (!address?.line2) tempErrors["address.line2"] = "Street/Village is required";
        if (!address?.city) tempErrors["address.city"] = "City is required";
        if (!address?.state) tempErrors["address.state"] = "State is required";
        if (!address?.postCode) tempErrors["address.postCode"] = "Postal Code is required";
        if (!address?.country) tempErrors["address.country"] = "Country is required";

        const phone = (form.phones ?? [])[0];
        if (!phone?.countryCode) tempErrors["phone.countryCode"] = "Country code is required";
        if (!phone?.number) tempErrors["phone.number"] = "Phone number is required";

        (form.identifiers ?? []).forEach((id) => {
            if (id.type === "ABHA") {
                if (!/^\d{2}-\d{4}-\d{4}-\d{4}$/.test(id.value)) {
                    tempErrors[`identifiers.abha`] = "ABHA must follow the format 12-1234-1234-1234";
                }
            } else if (!id.value) {
                tempErrors[`identifiers.${id.type.toLowerCase()}`] = `${id.type} number is required`;
            }
        });

        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    }

    return (
        <div className="flex-1 p-4 bg-base-200">

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative mb-6 h-12 flex items-center justify-center">
                    {/* Centered Heading */}
                    <h2 className="text-lg font-semibold text-neutral-700 absolute left-1/2 transform -translate-x-1/2">
                        Patient Registration
                    </h2>

                    {/* Back Button on the Left */}
                    <Link
                        to="/health-records"
                        className="absolute left-0 btn btn-ghost flex items-center gap-2"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 19l-7-7 7-7"
                            />
                        </svg>
                        Back
                    </Link>
                </div>

                <div className="collapse bg-base-100">
                    <input type="checkbox" defaultChecked />
                    <div className="collapse-title text-sm font-medium text-neutral-700 border-b pb-1"><span className="arrow-indicator">&#9662;</span>Identifiers</div>
                    <div className="collapse-content">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4"></div>
                        {form.identifiers?.map((identifier, index) => (
                            <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 items-center">
                                {identifier.type === 'ABHA' || identifier.type === 'MRN' ? (
                                    <div>
                                        <label htmlFor={`identifier-type-${index}`} className="label">
                                            <span className="label-text text-sm font-medium text-gray-600">Identifier Type *</span>
                                        </label>
                                        <input
                                            id={`identifier-type-${index}`}
                                            value={identifier.type}
                                            readOnly
                                            className="input input-bordered w-full"
                                            disabled
                                        />
                                    </div>
                                ) : (
                                    <div>
                                        <label htmlFor={`identifier-type-${index}`} className="label">
                                            <span className="label-text text-sm font-medium text-gray-600">Identifier Type</span>
                                        </label>
                                        <select
                                            id={`identifier-type-${index}`}
                                            value={identifier.type}
                                            onChange={(e) => handleArrayChange(index, 'type', e.target.value, 'identifiers')}
                                            className="select select-bordered w-full"
                                        >
                                            <option value="">Select Identifier Type</option>
                                            {identifierTypes
                                                .filter(opt => opt !== 'ABHA' && opt !== 'MRN')
                                                .map(opt => (
                                                    <option key={opt} value={opt}>{opt}</option>
                                                ))}
                                        </select>
                                    </div>
                                )}
                                <div>
                                    <label htmlFor={`identifier-value-${index}`} className="label">
                                        <span className="label-text text-sm font-medium text-gray-600">{`${identifier.type} Number *`}</span>
                                    </label>
                                    <input
                                        id={`identifier-value-${index}`}
                                        value={identifier.value}
                                        onChange={(e) => handleArrayChange(index, 'value', e.target.value, 'identifiers')}
                                        placeholder={`${identifier.type} Number *`}
                                        className="input input-bordered w-full"
                                    />
                                    {identifier.type === 'ABHA' && errors['identifiers.abha'] && (
                                        <p className="text-red-500 text-xs mt-1">{errors['identifiers.abha']}</p>
                                    )}
                                </div>
                                {identifier.type !== 'ABHA' && identifier.type !== 'MRN' && (
                                    <div>
                                        <button
                                            type="button"
                                            onClick={() => removeArrayEntry(index, 'identifiers')}
                                            className="btn btn-primary w-16 mt-6"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={() => addArrayEntry('identifiers')}
                            className="btn btn-primary"
                        >
                            <FaPlus /> Add Identifier
                        </button>
                    </div>
                </div>

                <div className="collapse bg-base-100">
                    <input type="checkbox" defaultChecked />
                    <div className="collapse-title text-sm font-medium text-neutral-700 border-b pb-1">
                        <span className="arrow-indicator">&#9662;</span>Full Name</div>
                    <div className="collapse-content">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label htmlFor="namePrefix" className="label">
                                    <span className="label-text text-sm font-medium text-gray-600">Prefix</span>
                                </label>
                                <select
                                    id="namePrefix"
                                    name="namePrefix"
                                    value={form.namePrefix}
                                    onChange={handleChange}
                                    className="select select-bordered w-full"
                                >
                                    <option value="">Select Prefix</option>
                                    {namePrefixes.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                </select>
                            </div>
                            <div>
                                <label htmlFor="firstName" className="label">
                                    <span className="label-text text-sm font-medium text-gray-600">First Name *</span>
                                </label>
                                <input
                                    id="firstName"
                                    name="firstName"
                                    value={form.firstName}
                                    onChange={handleChange}
                                    placeholder="First Name *"
                                    className="input input-bordered w-full"
                                />
                                {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                            </div>
                            <div>
                                <label htmlFor="middleName" className="label">
                                    <span className="label-text text-sm font-medium text-gray-600">Middle Name</span>
                                </label>
                                <input
                                    id="middleName"
                                    name="middleName"
                                    value={form.middleName}
                                    onChange={handleChange}
                                    placeholder="Middle Name"
                                    className="input input-bordered w-full"
                                />
                            </div>
                            <div>
                                <label htmlFor="lastName" className="label">
                                    <span className="label-text text-sm font-medium text-gray-600">Last Name *</span>
                                </label>
                                <input
                                    id="lastName"
                                    name="lastName"
                                    value={form.lastName}
                                    onChange={handleChange}
                                    placeholder="Last Name *"
                                    className="input input-bordered w-full"
                                />
                                {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="collapse bg-base-100">
                    <input type="checkbox" defaultChecked />
                    <div className="collapse-title text-sm font-medium text-neutral-700 border-b pb-1"><span className="arrow-indicator">&#9662;</span>Core Information</div>
                    <div className="collapse-content">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label htmlFor="birthDate" className="label">
                                    <span className="label-text text-sm font-medium text-gray-600">Birth Date *</span>
                                </label>
                                <input
                                    id="birthDate"
                                    name="birthDate"
                                    value={form.birthDate}
                                    onChange={handleChange}
                                    type="date"
                                    placeholder="Birth Date *"
                                    className="input input-bordered w-full"
                                />
                                {errors.birthDate && <p className="text-red-500 text-xs mt-1">{errors.birthDate}</p>}
                            </div>
                            <div>
                                <label htmlFor="gender" className="label">
                                    <span className="label-text text-sm font-medium text-gray-600">Gender</span>
                                </label>
                                <select
                                    id="gender"
                                    name="gender"
                                    value={form.gender}
                                    onChange={handleChange}
                                    className="select select-bordered w-full"
                                >
                                    <option value="">Select Gender</option>
                                    {genders.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                </select>
                            </div>
                            <div>
                                <label htmlFor="bloodGroup" className="label">
                                    <span className="label-text text-sm font-medium text-gray-600">Blood Group</span>
                                </label>
                                <select
                                    id="bloodGroup"
                                    name="bloodGroup"
                                    value={form.bloodGroup}
                                    onChange={handleChange}
                                    className="select select-bordered w-full"
                                >
                                    <option value="">Select Blood Group</option>
                                    {bloodGroups.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                </select>
                            </div>
                            <div>
                                <label htmlFor="maritalStatus" className="label">
                                    <span className="label-text text-sm font-medium text-gray-600">Marital Status</span>
                                </label>
                                <select
                                    id="maritalStatus"
                                    name="maritalStatus"
                                    value={form.maritalStatus}
                                    onChange={handleChange}
                                    className="select select-bordered w-full"
                                >
                                    <option value="">Select Marital Status</option>
                                    {maritalStatuses.map(opt => (
                                        <option key={opt} value={opt}>{opt}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="collapse bg-base-100">
                    <input type="checkbox" defaultChecked />
                    <div className="collapse-title text-sm font-medium text-neutral-700 border-b pb-1 relative">
                        <span className="arrow-indicator">&#9662;</span>Address

                    </div>
                    <div className="collapse-content relative">
                        <div className="flex justify-end mb-4">
                            <button
                                type="button"
                                onClick={() => addArrayEntry('addresses')}
                                className="btn btn-primary absolute top-0 right-0 flex items-center gap-2"
                            >
                                <FaPlus /> Add Address
                            </button>
                        </div>
                        {form.addresses?.map((address, index) => (
                            <div key={index} className="mb-6 border border-gray-300 rounded-lg p-4 shadow-sm bg-white">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label htmlFor={`address-line1-${index}`} className="label">
                                            <span className="label-text text-sm font-medium text-gray-600">
                                                House No./Flat No. {index === 0 ? '*' : ''}
                                            </span>
                                        </label>
                                        <input
                                            id={`address-line1-${index}`}
                                            value={address.line1}
                                            onChange={(e) => handleArrayChange(index, 'line1', e.target.value, 'addresses')}
                                            placeholder="House No./Flat No."
                                            className="input input-bordered w-full"
                                            required={index === 0}
                                        />
                                        {index === 0 && errors["address.line1"] && (
                                            <p className="text-red-500 text-xs mt-1">{errors["address.line1"]}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label htmlFor={`address-line2-${index}`} className="label">
                                            <span className="label-text text-sm font-medium text-gray-600">Street/Village *</span>
                                        </label>
                                        <input
                                            id={`address-line2-${index}`}
                                            value={address.line2 || ''}
                                            onChange={(e) => handleArrayChange(index, 'line2', e.target.value, 'addresses')}
                                            placeholder="Street/Village"
                                            className="input input-bordered w-full"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor={`address-city-${index}`} className="label">
                                            <span className="label-text text-sm font-medium text-gray-600">
                                                City {index === 0 ? '*' : ''}
                                            </span>
                                        </label>
                                        <input
                                            id={`address-city-${index}`}
                                            value={address.city}
                                            onChange={(e) => handleArrayChange(index, 'city', e.target.value, 'addresses')}
                                            placeholder="City"
                                            className="input input-bordered w-full"
                                            required={index === 0}
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor={`address-state-${index}`} className="label">
                                            <span className="label-text text-sm font-medium text-gray-600">
                                                State {index === 0 ? '*' : ''}
                                            </span>
                                        </label>
                                        <select
                                            id={`address-state-${index}`}
                                            value={address.state}
                                            onChange={(e) => handleArrayChange(index, 'state', e.target.value, 'addresses')}
                                            className="select select-bordered w-full"
                                            required={index === 0}
                                        >
                                            <option value="">Select State</option>
                                            {indianStates.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label htmlFor={`address-postCode-${index}`} className="label">
                                            <span className="label-text text-sm font-medium text-gray-600">
                                                Postal Code {index === 0 ? '*' : ''}
                                            </span>
                                        </label>
                                        <input
                                            id={`address-postCode-${index}`}
                                            value={address.postCode}
                                            onChange={(e) => handleArrayChange(index, 'postCode', e.target.value, 'addresses')}
                                            placeholder="Postal Code"
                                            className="input input-bordered w-full"
                                            required={index === 0}
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor={`address-country-${index}`} className="label">
                                            <span className="label-text text-sm font-medium text-gray-600">
                                                Country {index === 0 ? '*' : ''}
                                            </span>
                                        </label>
                                        <select
                                            id={`address-country-${index}`}
                                            value={address.country}
                                            onChange={(e) => handleArrayChange(index, 'country', e.target.value, 'addresses')}
                                            className="select select-bordered w-full"
                                            required={index === 0}
                                        >
                                            <option value="">Select Country</option>
                                            {countries.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                        </select>
                                    </div>
                                </div>
                                {index > 0 && (
                                    <div className="mt-4">
                                        <button
                                            type="button"
                                            onClick={() => removeArrayEntry(index, 'addresses')}
                                            className="btn btn-outline btn-error gap-2"
                                        >
                                            <FaTrashAlt /> Remove
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="collapse bg-base-100">
                    <input type="checkbox" defaultChecked />
                    <div className="collapse-title text-sm font-medium text-neutral-700 border-b pb-1"><span className="arrow-indicator">&#9662;</span>Contact Information</div>
                    <div className="collapse-content">
                        <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                            <div>
                                <label htmlFor="email" className="label">
                                    <span className="label-text text-sm font-medium text-gray-600">Email *</span>
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    type="email"
                                    placeholder="Email *"
                                    className="input input-bordered w-full"
                                />
                                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                            </div>
                            <div>
                                {form.phones?.map((phone, index) => (
                                    <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                        <div>
                                            <label htmlFor={`phone-countryCode-${index}`} className="label">
                                                <span className="label-text text-sm font-medium text-gray-600">Country Code {index === 0 ? '*' : ''}</span>
                                            </label>
                                            <input
                                                id={`phone-countryCode-${index}`}
                                                name={`phones[${index}].countryCode`}
                                                value={phone.countryCode}
                                                onChange={(e) => handleArrayChange(index, 'countryCode', e.target.value, 'phones')}
                                                placeholder="Country Code"
                                                className="input input-bordered w-full"
                                                required={index === 0}
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor={`phone-type-${index}`} className="label">
                                                <span className="label-text text-sm font-medium text-gray-600">Phone Type</span>
                                            </label>
                                            <select
                                                id={`phone-type-${index}`}
                                                value={phone.type}
                                                onChange={(e) => handleArrayChange(index, 'type', e.target.value, 'phones')}
                                                className="select select-bordered w-full"
                                            >
                                                <option value="">Select Type</option>
                                                <option value="Mobile">Mobile</option>
                                                <option value="Home">Home</option>
                                                <option value="Work">Work</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label htmlFor={`phone-number-${index}`} className="label">
                                                <span className="label-text text-sm font-medium text-gray-600">Phone Number {index === 0 ? '*' : ''}</span>
                                            </label>
                                            <input
                                                id={`phone-number-${index}`}
                                                name={`phones[${index}].number`}
                                                value={phone.number}
                                                onChange={(e) => handleArrayChange(index, 'number', e.target.value, 'phones')}
                                                placeholder="Phone Number"
                                                className="input input-bordered w-full"
                                                required={index === 0}
                                            />
                                            {index === 0 && errors["phone.number"] && (
                                                <p className="text-red-500 text-xs mt-1">{errors["phone.number"]}</p>
                                            )}
                                        </div>
                                        {index > 0 && (
                                            <div>
                                                <button
                                                    type="button"
                                                    onClick={() => removeArrayEntry(index, 'phones')}
                                                    className="btn btn-primary w-16 mt-6"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={() => addArrayEntry('phones')}
                                    className="btn btn-primary"
                                >
                                    <FaPlus /> Add Phone
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="collapse bg-base-100">
                    <input type="checkbox" defaultChecked />
                    <div className="collapse-title text-sm font-medium text-neutral-700 border-b pb-1 relative">
                        <span className="arrow-indicator">&#9662;</span>Relationships
                    </div>
                    <div className="collapse-content relative">
                        <div className="flex justify-end mb-4">
                            <button
                                type="button"
                                onClick={() => addArrayEntry('emergencyContacts')}
                                className="btn btn-primary absolute top-0 right-0 flex items-center gap-2"
                            >
                                <FaPlus /> Add Emergency Contact
                            </button>
                        </div>
                        {form.emergencyContacts?.map((contact, index) => (
                            <div key={index} className="mb-6 border border-gray-300 rounded-lg p-4 shadow-sm bg-white hover:shadow-lg transition-shadow duration-200">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                                    <div>
                                        <label htmlFor={`emergency-name-${index}`} className="label">
                                            <span className="label-text text-sm font-medium text-gray-600">Emergency Contact Name</span>
                                        </label>
                                        <input
                                            id={`emergency-name-${index}`}
                                            value={contact.emergencyName}
                                            onChange={(e) => handleArrayChange(index, 'emergencyName', e.target.value, 'emergencyContacts')}
                                            placeholder="Name"
                                            className="input input-bordered w-full"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor={`emergency-relation-${index}`} className="label">
                                            <span className="label-text text-sm font-medium text-gray-600">Relationship</span>
                                        </label>
                                        <select
                                            id={`emergency-relation-${index}`}
                                            value={contact.emergencyRelation || ''}
                                            onChange={(e) => handleArrayChange(index, 'emergencyRelation', e.target.value, 'emergencyContacts')}
                                            className="select select-bordered w-full"
                                        >
                                            <option value="">Select Relationship</option>
                                            {relationships.map((opt) => (
                                                <option key={opt} value={opt}>
                                                    {opt}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="flex-1">
                                            <label htmlFor={`emergency-phone-${index}`} className="label">
                                                <span className="label-text text-sm font-medium text-gray-600">Emergency Phone</span>
                                            </label>
                                            <input
                                                id={`emergency-phone-${index}`}
                                                value={contact.emergencyPhone}
                                                onChange={(e) => handleArrayChange(index, 'emergencyPhone', e.target.value, 'emergencyContacts')}
                                                placeholder="Phone Number"
                                                className="input input-bordered w-full"
                                            />
                                        </div>
                                        {index > 0 && (
                                            <button
                                                type="button"
                                                onClick={() => removeArrayEntry(index, 'emergencyContacts')}
                                                className="btn btn-outline btn-error gap-2 mt-6"
                                            >
                                                <FaTrashAlt /> Remove
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="collapse bg-base-100">
                    <input type="checkbox" defaultChecked />
                    <div className="collapse-title text-sm font-medium text-neutral-700 border-b pb-1"><span className="arrow-indicator">&#9662;</span>Communication and Preferences</div>
                    <div className="collapse-content">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label htmlFor="preferredContactMethod" className="label">
                                    <span className="label-text text-sm font-medium text-gray-600">Preferred Contact Method</span>
                                </label>
                                <select
                                    id="preferredContactMethod"
                                    name="preferredContactMethod"
                                    value={form.preferredContactMethod}
                                    onChange={handleChange}
                                    className="select select-bordered w-full"
                                >
                                    <option value="">Preferred Contact</option>
                                    {contactMethods.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="label cursor-pointer">
                                    <span className="label-text mr-2 text-sm font-medium text-gray-600">Appointment Reminders</span>
                                    <input
                                        type="checkbox"
                                        name="appointmentReminders"
                                        checked={form.appointmentReminders}
                                        onChange={handleChange}
                                        className="checkbox"
                                    />
                                </label>
                            </div>
                            <div>
                                <label htmlFor="interpreterRequired" className="label">
                                    <span className="label-text text-sm font-medium text-gray-600">Interpreter Required</span>
                                </label>
                                <input
                                    id="interpreterRequired"
                                    name="interpreterRequired"
                                    value={form.interpreterRequired}
                                    onChange={handleChange}
                                    placeholder="Interpreter Required"
                                    className="input input-bordered w-full"
                                />
                            </div>
                            <div>
                                <label htmlFor="preferredLanguage" className="label">
                                    <span className="label-text text-sm font-medium text-gray-600">Preferred Language</span>
                                </label>
                                <select
                                    id="preferredLanguage"
                                    name="preferredLanguage"
                                    onChange={handleChange}
                                    className="select select-bordered w-full"
                                >
                                    <option value="">Preferred Language</option>
                                    <option value="English">English</option>
                                    <option value="Telugu">Telugu</option>
                                    <option value="Hindi">Hindi</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="collapse bg-base-100">
                    <input type="checkbox" defaultChecked />
                    <div className="collapse-title text-sm font-medium text-neutral-700 border-b pb-1"><span className="arrow-indicator">&#9662;</span>Legal and Consent</div>
                    <div className="collapse-content">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label htmlFor="ethnicity" className="label">
                                    <span className="label-text text-sm font-medium text-gray-600">Ethnicity</span>
                                </label>
                                <input
                                    id="ethnicity"
                                    name="ethnicity"
                                    value={form.ethnicity}
                                    onChange={handleChange}
                                    placeholder="Ethnicity"
                                    className="input input-bordered w-full"
                                />
                            </div>
                            <div>
                                <label htmlFor="race" className="label">
                                    <span className="label-text text-sm font-medium text-gray-600">Race</span>
                                </label>
                                <input
                                    id="race"
                                    name="race"
                                    value={form.race}
                                    onChange={handleChange}
                                    placeholder="Race"
                                    className="input input-bordered w-full"
                                />
                            </div>
                            <div>
                                <label className="label cursor-pointer">
                                    <span className="label-text mr-2 text-sm font-medium text-gray-600">Organ Donor</span>
                                    <input
                                        type="checkbox"
                                        name="organDonor"
                                        checked={form.organDonor}
                                        onChange={handleChange}
                                        className="checkbox"
                                    />
                                </label>
                            </div>
                            <div>
                                <label className="label cursor-pointer">
                                    <span className="label-text mr-2 text-sm font-medium text-gray-600">Living Will</span>
                                    <input
                                        type="checkbox"
                                        name="livingWill"
                                        checked={form.livingWill}
                                        onChange={handleChange}
                                        className="checkbox"
                                    />
                                </label>
                            </div>
                            <div>
                                <label className="label cursor-pointer">
                                    <span className="label-text mr-2 text-sm font-medium text-gray-600">Power of Attorney</span>
                                    <input
                                        type="checkbox"
                                        name="powerOfAttorney"
                                        checked={form.powerOfAttorney}
                                        onChange={handleChange}
                                        className="checkbox"
                                    />
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="form-control mt-6">
                    <button type="submit" className="btn btn-primary">Submit</button>
                </div>
            </form>
        </div>
    );
};

export default MainContent;