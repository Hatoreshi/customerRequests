import express from 'express';
import mongoose, {Types} from 'mongoose';
import {ObjectId} from 'mongodb';
import CustomerRequest from "../model/Request";


const requestRouter = express.Router();

requestRouter.post('/', async (req, res, next) => {
    try {
        const data = {
            title: req.body.title,
            description: req.body.description,
        };

        const request = new CustomerRequest(data);
        await request.save();
        return res.send(request);
    } catch (e) {
        if (e instanceof mongoose.Error.ValidationError) {
            return res.status(422).send(e);
        }
        return next(e);
    }
});

requestRouter.patch('/in_progress/:id', async (req, res, next) => {
   try {
       let _id: ObjectId;

       try {
           _id = new Types.ObjectId(req.params.id);
       } catch {
           return res.status(404).send({error: 'Wrong ObjectId'});
       }

       const request = await CustomerRequest.findByIdAndUpdate(_id, {status: 'in_progress'});

       if (!request) {
           return res.status(404).send({error: 'Not Found'});
       }

       res.send("Request status is 'in progress!'");
   } catch (e) {
       if (e instanceof mongoose.Error.ValidationError) {
           return res.status(422).send(e);
       }
       return next(e);
   }
});

requestRouter.patch('/complete/:id', async (req, res, next) => {
    try {
        let _id: ObjectId;

        try {
            _id = new Types.ObjectId(req.params.id);
        } catch {
            return res.status(404).send({error: 'Wrong ObjectId'});
        }

        const completedDescription = req.body.completedDescription;

        const updateData: any = { status: 'completed' };

        if (completedDescription) {
            updateData.completedDescription = completedDescription;
        }

        const request = await CustomerRequest.findByIdAndUpdate(_id, updateData, { new: true });

        if (!request) {
            return res.status(404).send({error: 'Not Found'});
        }

        res.send("Request status is 'completed'!");
    } catch (e) {
        if (e instanceof mongoose.Error.ValidationError) {
            return res.status(422).send(e);
        }
        return next(e);
    }
});

    requestRouter.patch('/cancel/:id', async (req, res, next) => {
    try {
        let _id: ObjectId;

        try {
            _id = new Types.ObjectId(req.params.id);
        } catch {
            return res.status(404).send({error: 'Wrong ObjectId'});
        }

        const cancelledDescription = req.body.cancelledDescription;

        const updateData: any = { status: 'cancelled' };

        if (cancelledDescription) {
            updateData.cancelledDescription = cancelledDescription;
        }

        const request = await CustomerRequest.findByIdAndUpdate(_id, updateData, { new: true });

        if (!request) {
            return res.status(404).send({error: 'Not Found'});
        }

        res.send("Request status is 'cancelled'!");
    } catch (e) {
        if (e instanceof mongoose.Error.ValidationError) {
            return res.status(422).send(e);
        }
        return next(e);
    }
});

// http://localhost:8000/requests?startDate=2025-03-01&endDate=2025-03-31 диапазон дат
// http://localhost:8000/requests?startDate=2025-03-01 конкретная дата
requestRouter.get('/', async (req, res, next) => {
    try {
        const { startDate, endDate } = req.query;

        const start = Array.isArray(startDate) ? startDate[0] : startDate;
        const end = Array.isArray(endDate) ? endDate[0] : endDate;

        if (!start && !end) {
            const customerRequests = await CustomerRequest.find();

            return res.send(customerRequests);
        }
        let filter: any = {};

        if (start && !end) {
            const startD = new Date(start as string);
            const endD = new Date(startD);
            endD.setHours(23, 59, 59, 999);

            filter.date = { $gte: startD, $lte: endD };
        } else if (start && end) {
            const startD = new Date(start as string);
            const endD = new Date(end as string);
            filter.date = { $gte: startD, $lte: endD };
        } else {
            return res.status(400).send('Invalid date');
        }
        const customerRequests = await CustomerRequest.find(filter);

        return res.send(customerRequests);
    } catch (e) {
        if (e instanceof mongoose.Error.ValidationError) {
            return res.status(422).send(e);
        }
        return next(e);
    }
});

requestRouter.patch('/cancelAll', async (req, res, next) => {
    try {
        const requests = await CustomerRequest.find({status: "in_progress"});

        if (requests.length === 0) {
            return res.status(404).send({ error: 'No requests in progress' });
        }

        await Promise.all(requests.map(async (item) => {
            item.status = "cancelled";
            await item.save();
        }));

        res.send("All requests' status changed to 'cancelled'!");
    } catch (e) {
        if (e instanceof mongoose.Error.ValidationError) {
            return res.status(422).send(e);
        }
        return next(e);
    }
});




export default requestRouter;
