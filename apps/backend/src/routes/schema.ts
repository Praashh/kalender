import { Elysia, t } from "elysia";

const signupBody = t.Object({
  email: t.String({ format: "email" }),
  username: t.Optional(t.String({ minLength: 3, maxLength: 20 })),
  password: t.String({ minLength: 8 }),
  name: t.Optional(t.String()),
});

const loginBody = t.Object({
  email: t.String({ format: "email" }),
  password: t.String({ minLength: 8 }),
});

const createEventTypeBody = t.Object({
  title: t.String(),
  duration: t.Number(),
  userId: t.String(),
});

const updateEventTypeBody = t.Object({
  title: t.String(),
  duration: t.Number(),
});

const createBookingBody = t.Object({
  eventTypeId: t.String(),
  hostId: t.String(),
  guestId: t.Optional(t.String()),
  guestEmail: t.String({format: 'email'}),
  startTime: t.String(),
  endTime: t.String()
})

const updateBookingBody = t.Object({
  startTime: t.String(),
  endTime: t.String()
})

const createAvailabilityBody = t.Object({
  days: t.Array(t.Number()),
  startTime: t.String(),
  endTime: t.String(),
  userId: t.String(),
  name: t.Optional(t.String()),
  eventTypeId: t.Optional(t.String())
})

const updateAvailabilityBody = t.Object({
  days: t.Array(t.Number()),
  startTime: t.String(),
  endTime: t.String()
})

export const authModel = new Elysia().model({
  "auth.register": signupBody,
  "auth.login": loginBody,
});

export const eventModel = new Elysia().model({
  "event.create": createEventTypeBody,
  "event.update": updateEventTypeBody,
});

export const bookingModel = new Elysia().model({
  'booking.create': createBookingBody,
  'booking.update': updateBookingBody
})

export const availabilityModel = new Elysia().model({
  'availability.create': createAvailabilityBody,
  'availability.update': updateAvailabilityBody
})