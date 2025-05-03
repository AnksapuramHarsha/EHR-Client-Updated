import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Patient } from '../types/patient';
import { getAllPatients, deletePatient, getPatientById, updatePatient } from '../apis/patientApi';
import { namePrefixes, genders, bloodGroups, indianStates, countries, contactMethods, maritalStatuses, relationships } from '../types/options';

const getCurrentDate = () => {
    const now = new Date();
    return now.toISOString().split('T')[0];
};

const getCurrentTime = () => {
    const now = new Date();
    return now.toTimeString().split(':').slice(0, 2).join(':');
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

const identifierTypes = ['Aadhar Card', 'PAN Card', 'Driving License'];

const PatientList = () => {
    const [patients, setPatients] = useState<Patient[]>([]);
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
    const [form, setForm] = useState<Patient>(emptyPatient);
    const [searchTerm, setSearchTerm] = useState('');
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        fetchPatients();
    }, []);

    const filteredPatients = patients.filter((patient) => {
        const fullName = `${patient.firstName} ${patient.lastName}`.toLowerCase();
        const term = searchTerm.toLowerCase();
        const nameMatch = fullName.includes(term);
        const phoneMatch = patient.phones?.some((phone) =>
            phone.number.toLowerCase().includes(term)
        );
        return nameMatch || phoneMatch;
    });

    const fetchPatients = async () => {
        try {
            const data = await getAllPatients();
            setPatients(data);
            toast.success('Patients fetched successfully!');
        } catch (error) {
            console.error('Error fetching patients:', error);
            toast.error('Failed to fetch patients.');
        }
    };

    const handleDelete = async (id: string) => {
        const isConfirmed = window.confirm('Are you sure you want to delete this patient?');
        if (isConfirmed) {
            try {
                await deletePatient(id);
                setPatients(patients.filter((patient) => patient.id !== id));
                toast.success('Patient deleted successfully');
            } catch (error) {
                toast.error('Failed to delete patient.');
                console.error('Error deleting patient:', error);
            }
        }
    };

    const handleView = async (id: string) => {
        try {
            const data = await getPatientById(id);
            setSelectedPatient(data[0]);
            toast.success('Patient fetched successfully!');
            const modal = document.getElementById('my_modal_5') as HTMLDialogElement;
            modal.showModal();
        } catch (error) {
            console.error('Error fetching patient:', error);
            toast.error('Failed to fetch patient.');
        }
    };

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
        arrayType: 'addresses' | 'phones' | 'identifiers' | 'relationships' | 'emergencyContacts'
    ) => {
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

    const handleEdit = async (id: string) => {
        try {
            const patient = await getPatientById(id);
            setForm(patient[0]);
            setErrors({});
            const modal = document.getElementById('edit_modal') as HTMLDialogElement;
            modal.showModal();
        } catch (err) {
            toast.error('Failed to fetch patient for edit.');
            console.log(err);
        }
    };

    const validate = () => {
        const tempErrors: { [key: string]: string } = {};
        if (!form.firstName) {
            tempErrors.firstName = 'First Name is required';
        } else if (!/^[A-Za-z\s]+$/.test(form.firstName)) {
            tempErrors.firstName = 'First Name must contain only letters and spaces';
        }
        if (!form.lastName) {
            tempErrors.lastName = 'Last Name is required';
        } else if (!/^[A-Za-z\s]+$/.test(form.lastName)) {
            tempErrors.lastName = 'Last Name must contain only letters and spaces';
        }
        if (!form.birthDate) {
            tempErrors.birthDate = 'Birth Date is required';
        } else {
            const today = new Date().toISOString().split('T')[0];
            if (form.birthDate >= today) {
                tempErrors.birthDate = 'Birth Date must be in the past';
            }
        }
        if (!form.email) {
            tempErrors.email = 'Email is required';
        } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(form.email)) {
            tempErrors.email = 'Please enter a valid email address';
        }

        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleUpdateSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!validate()) {
            toast.error('Please fix the errors in the form.');
            return;
        }
        try {
            const data = await updatePatient(form.id!, form);
            if (data) {
                toast.success('Patient updated successfully!');
                setForm(emptyPatient);
                (document.getElementById('edit_modal') as HTMLDialogElement)?.close();
                fetchPatients();
            }
        } catch (error: any) {
            if (error.response && error.response.status === 409) {
                const field = error.response.data.field || 'ABHA or Email';
                toast.error(`Conflict: A patient with this ${field} already exists.`);
            } else {
                toast.error('Failed to update patient.');
            }
            console.error('Submit error:', error);
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-2 px-4">
                <div className="w-full max-w-md">
                    <label htmlFor="search" className="label">
                    </label>
                    <div className="input input-bordered flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1011.5 3a7.5 7.5 0 005.15 13.65z" />
                        </svg>
                        <input
                            id="search"
                            type="text"
                            className="grow text-xs h-8"
                            placeholder="Search patients by name"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="table table-zebra table-xs table-bordered w-full border text-sm border-gray-300 border-collapse [&_th]:border [&_td]:border [&_th]:border-gray-300 [&_td]:border-gray-300">
                    <thead>
                        <tr>
                            <th className="text-sm">ID</th>
                            <th className="text-sm">Name</th>
                            <th className="text-sm">Date of Birth</th>
                            <th className="text-sm">Gender</th>
                            <th className="text-sm">Phone Number</th>
                            <th className="text-sm">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredPatients.map((patient) => (
                            <tr key={patient.id}>
                                <td className="text-sm">{patient.id}</td>
                                <td className="text-sm">{patient.firstName} {patient.lastName}</td>
                                <td className="text-sm">{patient.birthDate}</td>
                                <td className="text-sm">{patient.gender}</td>
                                <td className="text-sm">
                                    {patient.phones?.map((phone, index) => (
                                        <div key={index}>{phone.number}</div>
                                    ))}
                                </td>
                                <td>
                                    <button className="btn btn-primary btn-sm mr-2" onClick={() => patient.id && handleView(patient.id)}>Read</button>
                                    <button className="btn btn-warning btn-sm mr-2" onClick={() => patient.id && handleEdit(patient.id)}>Edit</button>
                                    <button className="btn btn-error btn-sm" onClick={() => patient.id && handleDelete(patient.id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <dialog id="my_modal_5" className="modal modal-bottom sm:modal-middle">
                <div className="modal-box w-full max-w-5xl">
                    <h2 className="text-base font-semibold mb-4 text-neutral-700">Patient Details</h2>
                    {selectedPatient && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 break-words">
                            <div><strong>Name:</strong> {selectedPatient.namePrefix} {selectedPatient.firstName} {selectedPatient.middleName} {selectedPatient.lastName}</div>
                            <div><strong>Date of Birth:</strong> {selectedPatient.birthDate}</div>
                            <div><strong>Gender:</strong> {selectedPatient.gender}</div>
                            <div><strong>Email:</strong> {selectedPatient.email}</div>
                            <div><strong>Blood Group:</strong> {selectedPatient.bloodGroup}</div>
                            <div><strong>Marital Status:</strong> {selectedPatient.maritalStatus}</div>
                            <div><strong>Phone Numbers:</strong>
                                {selectedPatient.phones?.length ? (
                                    <ul className="list-disc pl-5">
                                        {selectedPatient.phones.map((phone, index) => (
                                            <li key={index}>{phone.type}: {phone.number}</li>
                                        ))}
                                    </ul>
                                ) : (
                                    <span> None</span>
                                )}
                            </div>
                            <div><strong>Emergency Contacts:</strong>
                                {selectedPatient.emergencyContacts?.length ? (
                                    <ul className="list-disc pl-5">
                                        {selectedPatient.emergencyContacts.map((contact, index) => (
                                            <li key={index}>{contact.emergencyName} ({contact.emergencyRelation}) - {contact.emergencyPhone}</li>
                                        ))}
                                    </ul>
                                ) : (
                                    <span> None</span>
                                )}
                            </div>
                            <div><strong>Identifiers:</strong>
                                {selectedPatient.identifiers?.length ? (
                                    <ul className="list-disc pl-5">
                                        {selectedPatient.identifiers.map((id, index) => (
                                            <li key={index}>{id.type}: {id.value}</li>
                                        ))}
                                    </ul>
                                ) : (
                                    <span> None</span>
                                )}
                            </div>
                            <div><strong>Preferred Contact Method:</strong> {selectedPatient.preferredContactMethod}</div>
                            <div><strong>Appointment Reminders:</strong> {selectedPatient.appointmentReminders ? 'Yes' : 'No'}</div>
                            <div><strong>Preferred Language:</strong> {selectedPatient.preferedLanguage}</div>
                            <div><strong>Interpreter Required:</strong> {selectedPatient.interpreterRequired}</div>
                            <div><strong>Ethnicity:</strong> {selectedPatient.ethnicity}</div>
                            <div><strong>Race:</strong> {selectedPatient.race}</div>
                            <div><strong>Organ Donor:</strong> {selectedPatient.organDonor ? 'Yes' : 'No'}</div>
                            <div><strong>Living Will:</strong> {selectedPatient.livingWill ? 'Yes' : 'No'}</div>
                            <div><strong>Power of Attorney:</strong> {selectedPatient.powerOfAttorney ? 'Yes' : 'No'}</div>
                            <div><strong>Comments:</strong> {selectedPatient.comments}</div>
                            <div className="col-span-2">
                                <strong>Addresses:</strong>
                                {selectedPatient.addresses?.length ? (
                                    <ul className="list-disc pl-5">
                                        {selectedPatient.addresses.map((addr, index) => (
                                            <li key={index}>
                                                {addr.line1}{addr.line2 ? `, ${addr.line2}` : ''}, {addr.city}, {addr.state}, {addr.postCode}, {addr.country}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <span> None</span>
                                )}
                            </div>
                        </div>
                    )}
                    <div className="modal-action">
                        <button className="btn" onClick={() => (document.getElementById('my_modal_5') as HTMLDialogElement)?.close()}>Close</button>
                    </div>
                </div>
            </dialog>
            <dialog id="edit_modal" className="modal modal-bottom sm:modal-middle">
                <div className="modal-box w-full max-w-5xl md:grid md:grid-cols-2 md:gap-4">
                    <h2 className="text-base font-semibold mb-4 text-neutral-700">Edit Patient</h2>
                    <form onSubmit={handleUpdateSubmit} className="space-y-4 col-span-2">
                        <div>
                            <h3 className="text-sm font-semibold mb-2 border-b pb-1 text-neutral-700">Full Name</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="namePrefix" className="label">
                                        <span className="label-text text-sm font-medium text-gray-600">Prefix</span>
                                    </label>
                                    <select
                                        id="namePrefix"
                                        name="namePrefix"
                                        value={form.namePrefix}
                                        onChange={handleChange}
                                        className="select select-bordered w-full text-sm"
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
                                        className="input input-bordered w-full text-sm"
                                    />
                                    {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                                </div>
                                <div>
                                    <label htmlFor="middleName" className="label">
                                        <span className="label-text">Middle Name</span>
                                    </label>
                                    <input
                                        id="middleName"
                                        name="middleName"
                                        value={form.middleName}
                                        onChange={handleChange}
                                        placeholder="Middle Name"
                                        className="input input-bordered w-full text-sm"
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
                                        className="input input-bordered w-full text-sm"
                                    />
                                    {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
                                </div>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold mb-2 border-b pb-1 text-neutral-700">Core Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                        className="input input-bordered w-full text-sm"
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
                                        className="select select-bordered w-full text-sm"
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
                                        className="select select-bordered w-full text-sm"
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
                                        className="select select-bordered w-full text-sm"
                                    >
                                        <option value="">Select Marital Status</option>
                                        {maritalStatuses.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold mb-2 border-b pb-1 text-neutral-700">Address</h3>
                            {form.addresses?.map((address, index) => (
                                <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <label htmlFor={`address-line1-${index}`} className="label">
                                            <span className="label-text text-sm font-medium text-gray-600">House No./Flat No. {index === 0 ? '*' : ''}</span>
                                        </label>
                                        <input
                                            id={`address-line1-${index}`}
                                            value={address.line1}
                                            onChange={(e) => handleArrayChange(index, 'line1', e.target.value, 'addresses')}
                                            placeholder="Address Line 1"
                                            className="input input-bordered w-full text-sm"
                                            required={index === 0}
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor={`address-line2-${index}`} className="label">
                                            <span className="label-text text-sm font-medium text-gray-600">Street/Village *</span>
                                        </label>
                                        <input
                                            id={`address-line2-${index}`}
                                            value={address.line2 || ''}
                                            onChange={(e) => handleArrayChange(index, 'line2', e.target.value, 'addresses')}
                                            placeholder="Address Line 2"
                                            className="input input-bordered w-full text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor={`address-city-${index}`} className="label">
                                            <span className="label-text text-sm font-medium text-gray-600">City {index === 0 ? '*' : ''}</span>
                                        </label>
                                        <input
                                            id={`address-city-${index}`}
                                            value={address.city}
                                            onChange={(e) => handleArrayChange(index, 'city', e.target.value, 'addresses')}
                                            placeholder="City"
                                            className="input input-bordered w-full text-sm"
                                            required={index === 0}
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor={`address-state-${index}`} className="label">
                                            <span className="label-text text-sm font-medium text-gray-600">State {index === 0 ? '*' : ''}</span>
                                        </label>
                                        <select
                                            id={`address-state-${index}`}
                                            value={address.state}
                                            onChange={(e) => handleArrayChange(index, 'state', e.target.value, 'addresses')}
                                            className="select select-bordered w-full text-sm"
                                            required={index === 0}
                                        >
                                            <option value="">Select State</option>
                                            {indianStates.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label htmlFor={`address-postCode-${index}`} className="label">
                                            <span className="label-text text-sm font-medium text-gray-600">Postal Code {index === 0 ? '*' : ''}</span>
                                        </label>
                                        <input
                                            id={`address-postCode-${index}`}
                                            value={address.postCode}
                                            onChange={(e) => handleArrayChange(index, 'postCode', e.target.value, 'addresses')}
                                            placeholder="Postal Code"
                                            className="input input-bordered w-full text-sm"
                                            required={index === 0}
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor={`address-country-${index}`} className="label">
                                            <span className="label-text text-sm font-medium text-gray-600">Country {index === 0 ? '*' : ''}</span>
                                        </label>
                                        <select
                                            id={`address-country-${index}`}
                                            value={address.country}
                                            onChange={(e) => handleArrayChange(index, 'country', e.target.value, 'addresses')}
                                            className="select select-bordered w-full text-sm"
                                            required={index === 0}
                                        >
                                            <option value="">Select Country</option>
                                            {countries.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                        </select>
                                    </div>
                                    {index > 0 && (
                                        <div>
                                            <button
                                                type="button"
                                                onClick={() => removeArrayEntry(index, 'addresses')}
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
                                onClick={() => addArrayEntry('addresses')}
                                className="btn btn-primary"
                            >
                                Add Address
                            </button>
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold mb-2 border-b pb-1 text-neutral-700">Identifiers</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            </div>
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
                                                className="input input-bordered w-full text-sm"
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
                                                className="select select-bordered w-full text-sm"
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
                                            className="input input-bordered w-full text-sm"
                                        />
                                        {errors[`identifiers.${identifier.type.toLowerCase()}`] && (
                                            <p className="text-red-500 text-xs mt-1">
                                                {errors[`identifiers.${identifier.type.toLowerCase()}`]}
                                            </p>
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
                                Add Identifier
                            </button>
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold mb-2 border-b pb-1 text-neutral-700">Contact Information</h3>
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
                                        className="input input-bordered w-full text-sm"
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
                                                    className="input input-bordered w-full text-sm"
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
                                                    className="select select-bordered w-full text-sm"
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
                                                    className="input input-bordered w-full text-sm"
                                                    required={index === 0}
                                                />
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
                                        Add Phone
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold mb-2 border-b pb-1 text-neutral-700">Relationships</h3>
                            {form.emergencyContacts?.map((contact, index) => (
                                <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 items-center">
                                    <div>
                                        <label htmlFor={`emergency-name-${index}`} className="label">
                                            <span className="label-text text-sm font-medium text-gray-600">Emergency Contact Name</span>
                                        </label>
                                        <input
                                            id={`emergency-name-${index}`}
                                            value={contact.emergencyName}
                                            onChange={(e) => handleArrayChange(index, 'emergencyName', e.target.value, 'emergencyContacts')}
                                            placeholder="Name"
                                            className="input input-bordered w-full text-sm"
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
                                            className="select select-bordered w-full text-sm"
                                        >
                                            <option value="">Select Relationship</option>
                                            {relationships.map((opt) => (
                                                <option key={opt} value={opt}>{opt}</option>
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
                                                className="input input-bordered w-full text-sm"
                                            />
                                        </div>
                                        {index > 0 && (
                                            <button
                                                type="button"
                                                onClick={() => removeArrayEntry(index, 'emergencyContacts')}
                                                className="btn btn-primary mt-6"
                                            >
                                                Remove
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={() => addArrayEntry('emergencyContacts')}
                                className="btn btn-primary"
                            >
                                Add Emergency Contact
                            </button>
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold mb-2 border-b pb-1 text-neutral-700">Communication and Preferences</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="preferredContactMethod" className="label">
                                        <span className="label-text text-sm font-medium text-gray-600">Preferred Contact Method</span>
                                    </label>
                                    <select
                                        id="preferredContactMethod"
                                        name="preferredContactMethod"
                                        value={form.preferredContactMethod}
                                        onChange={handleChange}
                                        className="select select-bordered w-full text-sm"
                                    >
                                        <option value="">Preferred Contact</option>
                                        {contactMethods.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="label cursor-pointer">
                                        <span className="label-text text-sm font-medium text-gray-600 mr-2">Appointment Reminders</span>
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
                                        className="input input-bordered w-full text-sm"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="preferredLanguage" className="label">
                                        <span className="label-text text-sm font-medium text-gray-600">Preferred Language</span>
                                    </label>
                                    <select
                                        id="preferredLanguage"
                                        name="preferedLanguage"
                                        value={form.preferedLanguage}
                                        onChange={handleChange}
                                        className="select select-bordered w-full text-sm"
                                    >
                                        <option value="">Preferred Language</option>
                                        <option value="English">English</option>
                                        <option value="Telugu">Telugu</option>
                                        <option value="Hindi">Hindi</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold mb-2 border-b pb-1 text-neutral-700">Legal and Consent</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                        className="input input-bordered w-full text-sm"
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
                                        className="input input-bordered w-full text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="label cursor-pointer">
                                        <span className="label-text text-sm font-medium text-gray-600 mr-2">Organ Donor</span>
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
                                        <span className="label-text text-sm font-medium text-gray-600 mr-2">Living Will</span>
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
                                        <span className="label-text text-sm font-medium text-gray-600 mr-2">Power of Attorney</span>
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
                        <div className="modal-action">
                            <button type="submit" className="btn btn-primary">Update</button>
                            <button type="button" className="btn" onClick={() => (document.getElementById('edit_modal') as HTMLDialogElement)?.close()}>
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </dialog>
        </div>
    );
};

export default PatientList;

