import mongoose from "mongoose";
import { IRole } from "../interfaces";


const roleSchema = new mongoose.Schema<IRole>({
    name: { type: String, required: true, unique: true },
    description: { type: String },
    permissions: { type: [String], required: true },
    isSystemRole: { type: Boolean, default: false },
}, { timestamps: true });


const Role = mongoose.models.Role || mongoose.model<IRole>("Role", roleSchema);

export default Role;
