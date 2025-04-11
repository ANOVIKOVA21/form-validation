import { createBookingSchema } from "./bookingSchema";

describe("Booking Schema", () => {
  const availableTimeSlots = ["10:00 AM", "2:00 PM"];
  const schema = createBookingSchema(availableTimeSlots);

  test("validates correctly for a valid input", () => {
    const result = schema.safeParse({
      bookerName: "John Doe",
      bookerEmail: "john.doe@example.com",
      eventName: "React Workshop",
      eventDate: new Date("2024-12-15"),
      numberOfGuests: 3,
      timeSlot: "10:00 AM",
      eventLink: "https://example.com",
    });

    expect(result.success).toBe(true);
  });

  test("fails when bookerName is too short", () => {
    const result = schema.safeParse({
      bookerName: "J",
      bookerEmail: "john.doe@example.com",
      eventName: "React Workshop",
      eventDate: new Date("2024-12-15"),
      numberOfGuests: 3,
      timeSlot: "10:00 AM",
      eventLink: "https://example.com",
    });

    expect(result.success).toBe(false);
    expect(result.error?.format().bookerName._errors).toContain(
      "Booker name must be at least 2 characters long"
    );
  });

  test("fails when bookerEmail is invalid", () => {
    const result = schema.safeParse({
      bookerName: "John Doe",
      bookerEmail: "not-an-email",
      eventName: "React Workshop",
      eventDate: new Date("2024-12-15"),
      numberOfGuests: 3,
      timeSlot: "10:00 AM",
      eventLink: "https://example.com",
    });

    expect(result.success).toBe(false);
    expect(result.error?.format().bookerEmail._errors).toContain(
      "Invalid email address"
    );
  });

  test("passes when bookerEmail is omitted or empty", () => {
    const result = schema.safeParse({
      bookerName: "John Doe",
      bookerEmail: "",
      eventName: "React Workshop",
      eventDate: new Date("2024-12-15"),
      numberOfGuests: 3,
      timeSlot: "10:00 AM",
      eventLink: "https://example.com",
    });

    expect(result.success).toBe(true);
  });

  test("fails when eventName is too short", () => {
    const result = schema.safeParse({
      bookerName: "John Doe",
      bookerEmail: "john.doe@example.com",
      eventName: "R",
      eventDate: new Date("2024-12-15"),
      numberOfGuests: 3,
      timeSlot: "10:00 AM",
      eventLink: "https://example.com",
    });

    expect(result.success).toBe(false);
    expect(result.error?.format().eventName._errors).toContain(
      "Event name must be at least 2 characters long"
    );
  });

  test("fails when eventDate is in the past", () => {
    const result = schema.safeParse({
      bookerName: "John Doe",
      bookerEmail: "john.doe@example.com",
      eventName: "React Workshop",
      eventDate: new Date("2023-12-01"), // Past date
      numberOfGuests: 3,
      timeSlot: "10:00 AM",
      eventLink: "https://example.com",
    });

    expect(result.success).toBe(false);
    expect(result.error?.format().eventDate._errors).toContain(
      "Event date must be in the future"
    );
  });

  test("fails when numberOfGuests is out of bounds", () => {
    const result = schema.safeParse({
      bookerName: "John Doe",
      bookerEmail: "john.doe@example.com",
      eventName: "React Workshop",
      eventDate: new Date("2024-12-15"),
      numberOfGuests: 11, // Too many guests
      timeSlot: "10:00 AM",
      eventLink: "https://example.com",
    });

    expect(result.success).toBe(false);
    expect(result.error?.format().numberOfGuests._errors).toContain(
      "Number must be less than or equal to 10"
    );
  });

  test("fails when timeSlot is unavailable", () => {
    const result = schema.safeParse({
      bookerName: "John Doe",
      bookerEmail: "john.doe@example.com",
      eventName: "React Workshop",
      eventDate: new Date("2024-12-15"),
      numberOfGuests: 3,
      timeSlot: "12:00 PM", // Unavailable time slot
      eventLink: "https://example.com",
    });

    expect(result.success).toBe(false);
    expect(result.error?.format().timeSlot._errors).toContain(
      "Selected time slot is unavailable"
    );
  });

  test("fails when eventLink is not a valid URL", () => {
    const result = schema.safeParse({
      bookerName: "John Doe",
      bookerEmail: "john.doe@example.com",
      eventName: "React Workshop",
      eventDate: new Date("2024-12-15"),
      numberOfGuests: 3,
      timeSlot: "10:00 AM",
      eventLink: "invalid-url", // Invalid URL
    });

    expect(result.success).toBe(false);
    expect(result.error?.format().eventLink._errors).toContain(
      "Invalid URL. Please enter a valid event link"
    );
  });

  test("fails when eventLink is omitted", () => {
    const result = schema.safeParse({
      bookerName: "John Doe",
      bookerEmail: "john.doe@example.com",
      eventName: "React Workshop",
      eventDate: new Date("2024-12-15"),
      numberOfGuests: 3,
      timeSlot: "10:00 AM",
      // eventLink is omitted
    });

    expect(result.success).toBe(false); // Validation should fail because eventLink is required
    expect(result.error?.issues[0]?.message).toBe("Required");
  });

  test("passes when all required fields are provided", () => {
    const result = schema.safeParse({
      bookerName: "John Doe",
      bookerEmail: "john.doe@example.com",
      eventName: "React Workshop",
      eventDate: new Date("2024-12-15"),
      numberOfGuests: 3,
      timeSlot: "10:00 AM",
      eventLink: "https://example.com", 
    });

    expect(result.success).toBe(true);
  });
});
