import connectDb from "@/db/connectDb";
import Location from "@/models/location";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        console.log("Request received");
        await connectDb();
        const { address, pincode, city, latitude, longitude } = await request.json();

        if (!address || !pincode || !city || !latitude || !longitude) {
            return NextResponse.json(
                { message: "All fields sent data are required" },
                { status: 400 }
            );
        }

        await Location.create({ address, pincode, city, geolocation: { latitude, longitude } });

        return NextResponse.json({ message: "Location saved successfully" }, { status: 201 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}

export async function GET() {
    try {
        await connectDb();
        const locations = await Location.find({});
        return NextResponse.json({ locations }, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
