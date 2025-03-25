const groupListByFieldSumField = (list, fieldName, sumField) => {
    return list.reduce((acc, d) => 
        {
            const found = acc.find(f => f[fieldName] === d[fieldName])
            if(found){
                found.list.push(d)
                if(sumField)
                    found.value += d[sumField]
            }
            else{
                acc.push({[fieldName]: d[fieldName], list: [d], value: (sumField? d[sumField] : 0)})
            }
            return acc 
        }, [])
}

const formater = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    // These options can be used to round to whole numbers.
    //trailingZeroDisplay: 'stripIfInteger'   // This is probably what most people
                                            // want. It will only stop printing
                                            // the fraction when the input
                                            // amount is a round number (int)
                                            // already. If that's not what you
                                            // need, have a look at the options
                                            // below.
    //minimumFractionDigits: 0, // This suffices for whole numbers, but will
                                // print 2500.10 as $2,500.1
    //maximumFractionDigits: 0, // Causes 2500.99 to be printed as $2,501
  });

export { groupListByFieldSumField, formater }