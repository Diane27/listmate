import firebaseService from '../service-firebase'

const db = firebaseService.firestore();
export default class dataService {
    // Create new Data - CREATE (C)
    static create(collection, data){
        let docRef = db.collection(collection)
        return docRef.add(data)
        .then(result => {
            console.log("saved succesfully", result.id);
        })
        .catch(err => {
            console.log(err);
        })
    }

    // // Get all Data - READ (R)
    // static get(collection){
    //     let newList = [];
    //     db.collection(collection)
    //     .onSnapshot((snapshot) => {
    //         snapshot.forEach((doc) => {
    //             const list = Object.assign(
    //                 { id: doc.id},
    //                 doc.data()
    //             )
    //             newList.push(list);
    //         })
    //     })
    //     return newList;
    // }

    // Find one data - READ (R)
    static find(collection, arg){
        let newList = [];
        return db.collection(collection).where(arg.param, '==', arg.value)
        .get()
        .then((snapshot) => {
            snapshot.forEach((doc) => {
                const list = Object.assign(
                    { id: doc.id},
                    doc.data()
                    )
                    newList.push(list);
            })
            return newList;
        })
        .catch(err => {
            console.log(err);
        })
    }

    // Update Data - UPDATE (U)
    static update(collection, data){
        let docRef = db.collection(collection).doc(data.id);
        return docRef.update(data)
        .then(result => {
            console.log("updated succesfully", result.id);
        })
        .catch(err => {
            console.log(err);
        })
    }

    // Delete Data - DELETE (D)
    static remove(collection, docId){
        let docRef = db.collection(collection).doc(docId);
        return docRef.delete();   
    }

}