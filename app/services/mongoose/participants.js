const Events = require('../../api/v1/events/model');
const Orders = require('../../api/v1/orders/model');
const { NotFoundError } = require('../../errors');
const Participant = require('../../api/v1/participants/model');
const Payments = require('../../api/v1/payments/model');
const { BadRequestError, UnauthorizedError } = require('../../errors');
const { createJWT, createTokenParticipant } = require('../../utils');
const { otpMail } = require('../email/index');
const sendWhatsAppMessage = require('../whatsapp');

const getAllEvents = async (req) => {
    const result = await Events.find({ statusEvent: 'Published' })
        .populate('category')
        .populate('image')
        .select('_id title date tickets venueName statusEvent');
    return result;
};

const getOneEvent = async (req) => {
    const { id } = req.params;
    // console.log(id)
    const result = await Events.findOne({ _id: id })
        .populate('category')
        .populate({ path: 'talent', populate: 'image' })
        .populate('image');

    if (!result) throw new NotFoundError(`Tidak ada acara dengan id :  ${id}`);

    return result;
};

const signinParticipant = async (req) => {
    const { email, password } = req.body;
    // console.log(email);

    if (!email || !password) {
        throw new BadRequestError('Masukkan Email atau Password');
    }

    const result = await Participant.findOne({ email: email });

    if (!result) {
        throw new UnauthorizedError('Email Belum Terdaftar');
    }

    if (result.status === 'tidak aktif') {
        throw new UnauthorizedError('Akun anda belum aktif');
    }

    const isPasswordCorrect = await result.comparePassword(password);

    if (!isPasswordCorrect) {
        throw new UnauthorizedError('Email atau Password Salah');
    }

    const token = createJWT({ payload: createTokenParticipant(result) });

    return token;
};
const signupParticipant = async (req) => {
    const { firstName, lastName, email, password, role, phone } = req.body;

    // Function to format the phone number
    const formatPhoneNumber = (phoneNumber) => {
        if (phoneNumber.startsWith('08')) {
            // Replace '08' with '62'
            return '628' + phoneNumber.substring(2);
        } else if (phoneNumber.startsWith('62')) {
            // Phone number is already in the desired format
            return phoneNumber;
        } else {
            // Invalid phone number format, handle as needed
            throw new BadRequestError('Invalid phone number format');
        }
    };

    const formattedPhone = formatPhoneNumber(phone);

    let result = await Participant.findOne({ email, status: 'tidak aktif' });

    if (result) {
        result.firstName = firstName;
        result.lastName = lastName;
        result.role = role;
        result.email = email;
        result.phone = formattedPhone; // Use the formatted phone number
        result.password = password;
        result.otp = Math.floor(Math.random() * 9999);
        await result.save();
    } else {
        result = await Participant.create({
            firstName,
            lastName,
            email,
            password,
            role,
            phone: formattedPhone, // Use the formatted phone number
            otp: Math.floor(Math.random() * 9999),
        });
    }

    await otpMail(email, result);
    await sendWhatsAppMessage(formattedPhone, 'Kode OTP kamu : ' + result.otp);

    delete result._doc.password;
    delete result._doc.otp;

    return result;
};

const checkoutOrder = async (req) => {
    const { event, personalDetail, payment, tickets } = req.body;

    const checkingEvent = await Events.findOne({ _id: event });
    if (!checkingEvent) {
        throw new NotFoundError('Tidak ada acara dengan id : ' + event);
    }

    const checkingPayment = await Payments.findOne({ _id: payment });

    if (!checkingPayment) {
        throw new NotFoundError(
            'Tidak ada metode pembayaran dengan id :' + payment
        );
    }

    let totalPay = 0,
        totalOrderTicket = 0;
    await tickets.forEach((tic) => {
        checkingEvent.tickets.forEach((ticket) => {
            if (tic.ticketCategories.type === ticket.type) {
                if (tic.sumTicket > ticket.stock) {
                    throw new NotFoundError('Stock event tidak mencukupi');
                } else {
                    ticket.stock -= tic.sumTicket;

                    totalOrderTicket += tic.sumTicket;
                    totalPay += tic.ticketCategories.price * tic.sumTicket;
                }
            }
        });
    });

    await checkingEvent.save();

    const historyEvent = {
        title: checkingEvent.title,
        date: checkingEvent.date,
        about: checkingEvent.about,
        tagline: checkingEvent.tagline,
        keyPoint: checkingEvent.keyPoint,
        venueName: checkingEvent.venueName,
        tickets: tickets,
        image: checkingEvent.image,
        category: checkingEvent.category,
        talent: checkingEvent.talent,
        organizer: checkingEvent.organizer,
    };

    const result = new Orders({
        date: new Date(),
        personalDetail: personalDetail,
        totalPay,
        totalOrderTicket,
        orderItems: tickets,
        participant: req.participant.id,
        event,
        historyEvent,
        payment,
    });

    await result.save();
    return result;
};

const getAllPaymentByOrganizer = async (req) => {
    const { organizer } = req.params;

    const result = await Payments.find({ organizer: organizer });

    return result;
};
const activateParticipant = async (req) => {
    const { otp, email } = req.body;
    const check = await Participant.findOne({
        email,
    });

    if (!check) throw new NotFoundError('Partisipan belum terdaftar');

    if (check && check.otp !== otp) throw new BadRequestError('Kode otp salah');

    const result = await Participant.findByIdAndUpdate(
        check._id,
        {
            status: 'aktif',
        },
        { new: true }
    );

    delete result._doc.password;

    return result;
};
const getAllOrders = async (req) => {
    console.log(req.participant);
    const result = await Orders.find({ participant: req.participant.id });
    return result;
};
module.exports = {
    getAllEvents,
    getOneEvent,
    getAllOrders,
    signinParticipant,
    signupParticipant,
    activateParticipant,
    getAllPaymentByOrganizer,
    checkoutOrder
};