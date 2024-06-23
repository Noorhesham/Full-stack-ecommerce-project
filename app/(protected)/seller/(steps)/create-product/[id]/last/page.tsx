import { getProduct } from '@/app/actions/products'
import LastFormProduct from '@/app/components/LastFormProduct'
import { ProductProps } from '@/lib/database/models/ProductsModel'
import React from 'react'

const page =async ({ params }: { params: { id: string } }) => {
  const id = params.id
  const product :ProductProps|any =await getProduct(id)
  console.log(product)
  return (
    <LastFormProduct variations={product.product.variations}/>
  )
}

export default page
