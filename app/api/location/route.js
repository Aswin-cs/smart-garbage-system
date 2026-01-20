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

export async function DELETE(request) {
    try {
        await connectDb();
        const { id } = await request.json();

        if (!id) {
            return NextResponse.json({ message: "Location ID required" }, { status: 400 });
        }

        await Location.findByIdAndDelete(id);
        return NextResponse.json({ message: "Location deleted successfully" }, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}

export async function PUT(request) {
    try {
        await connectDb();
        // Updated to use search params if ID isn't in body using new URL(request.url).searchParams but standard JSON body is better for PUT
        const body = await request.json();
        const { id, address, city, pincode, latitude, longitude } = body;

        if (!id) {
            return NextResponse.json({ message: "Location ID required" }, { status: 400 });
        }

        const updatedLocation = await Location.findByIdAndUpdate(
            id,
            {
                address,
                city,
                pincode,
                geolocation: { latitude, longitude }
            },
            { new: true }
        );

        if (!updatedLocation) {
            return NextResponse.json({ message: "Location not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Location updated successfully", location: updatedLocation }, { status: 200 });

    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
