import express from 'express';
import {get, merge } from 'lodash';
import { getUserBySessionToken } from '../Models/userModels';


export const isAuthorized = async (req: express.Request, res: express.Response, next: express.NextFunction) => {


    try{


        const { id } = req.params;
        const currentUserId = get(req, 'identity.id') as string;

        if (!currentUserId) {
            return res.sendStatus(403);
        }

        if (currentUserId.toString() !== id) {
            return res.sendStatus(403);
        }


    } catch (error) {
        console.error(error.message);
        return res.sendStatus(400);
    }
};


export const isAuthenticated = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try{
        const sessionToken = req.cookies['sessionToken'];

        if(!sessionToken){
            return res.sendStatus(401);
        }

        const existingUser = await getUserBySessionToken(sessionToken);

        if(!existingUser){
            return res.sendStatus(403);
        }

        merge(req, { identity: existingUser });

        return next();

    } catch (error) {
        console.error(error.message);
        return res.sendStatus(400);
    }
}

