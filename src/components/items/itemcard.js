import React from 'react'
import { styled } from '@linaria/react';
import { colors, sizes } from '../../styles/vars';
import { ItemModel, ItemTypes } from '../../data/item';
import { affixKey, objToArray } from '../../lib/znzlib';
import { SelectInput, TextInput, TextAreaInput, HiddenInput } from '../field/input';
import { ItemTypesFieldCSS } from './dynamicCSS';
import { props } from 'bluebird';

export function Item( props ){


    let itemFields = ( props.index ) ? ItemModel : ItemModel.map(x => affixKey(props.index, x, null));
    let isInventory = props.inventory ?? false;

    const ItemCard = styled.div`

        textarea {
            height: 4rem;
            resize: vertical;
            margin-top: 2rem;
            font-size: small;
        }

        ${ItemTypesFieldCSS}
    `

    const ContentWrapper = styled.div`
    `

    const FlexRow = styled.div`
        display: flex;
        justify-content: space-between;
    `

    const NameRow = styled(FlexRow)`
        border-bottom: solid 2px ${colors.black};
        padding-bottom: 0.5rem;

        select {
            width: 25%;
            font-size: ${sizes.xSmall};
            margin-left: 0.5rem;
            padding: 0;
            text-align: center;
        }
    `

    return (
        <ItemCard>
            {ItemTypeArray.map((x,i)=>{
                return (
                    <HiddenInput className={`item-type-${x.key}`} field={x} value={x.key} key={i}></HiddenInput>
                )
            })}
            <ContentWrapper className="card-content">
                <NameRow>
                    <TextInput field={itemFields.name} placeholder="Item Name"/>
                    <SelectInput 
                        field={itemFields.type}
                        options={ItemTypeArray}
                        appearance={false}
                        disabled={!isInventory}
                    />
                </NameRow>

                <TextAreaInput field={itemFields.description} resize="vertical"/>
            </ContentWrapper>
        </ItemCard>
    )
}

function Hideablefield( props ){
    const Hideable = styled.div`
        display: none;
    `

    return (
        <Hideable className={props.className}>
            {props.children}
        </Hideable> 
    )
}

function MeleeField( props ){
    return (
        <Hideablefield className={`${ItemTypes.melee.key}-type-field`}>
            {props.children}
        </Hideablefield>
    )
}

function RangedField( props ){
    return (
        <Hideablefield className={`${ItemTypes.ranged.key}-type-field`}>
            {props.children}
        </Hideablefield>
    )
}

function ArmorField( props ){
    return (
        <Hideablefield className={`${ItemTypes.armor.key}-type-field`}>
            {props.children}
        </Hideablefield>
    )
}

function EquippableField( props ){
    return (
        <Hideablefield className={`${ItemTypes.melee.key}-type-field ${ItemTypes.ranged.key}-type-field ${ItemTypes.armor.key}-type-field`}>
            {props.children}
        </Hideablefield>
    )
}

function MiscField( props ){
    return (
        <Hideablefield className={`${ItemTypes.misc.key}-type-field`}>
            {props.children}
        </Hideablefield>
    )
}

