import { tezos } from "./tezos";

export const createService = async ({content, acc, cost}) => {
    try{
        const contract = await tezos.wallet.at("KT1SVrvay8ArKVA4AR9TYe9TyKnXQU5xCfjT");
        const methods = contract.parameterSchema.ExtractSignatures();
        console.log(methods);
        const op = await contract.methodsObject.default(content, acc, cost).send()
        await op.confirmation(1)
        console.log(op);
    }catch(err){
        console.log(err)
    }
}