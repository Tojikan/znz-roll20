import React from 'react'
import { styled } from '@linaria/react';
import { colors, fonts, sizes } from '../../styles/vars';
import { ItemModel, ItemTypes } from '../../data/item';
import { affixKey, objToArray, objMap } from '../../lib/znzlib';
import { SelectInput, TextInput, TextAreaInput, HiddenInput, NumberInput, DividerLine, ReadOnly } from '../field/input';
import { ToolTip } from '../field/tooltip';
import { ActionButton, BasicRollButton } from '../field/button';
import { CharacterModel } from '../../data/character';
import { GenerateReloadCommand } from '../../scripts/reload';
import { GenerateAttackRoll } from '../../scripts/attack';

const ItemTypeArray = objToArray(ItemTypes);

export function Item( props ){

    let itemFields = ( props.index ) ? objMap(ItemModel,(x) => affixKey(props.index, x, null)) : ItemModel;
    let isInventory = props.inventory ?? false;

    const ItemCard = styled.div`

        textarea {
            height: 4rem;
            resize: vertical;
            font-size: small;
            margin-top: 1rem;
        }

        ${ ItemTypeArray.reduce((prev, curr)=>{
            //If item type is checked, set field to display
            return prev + ` .item-type-${curr.key}:checked{
                ~ .hideable-fields {
                    .${curr.key}-type-field {
                        display: block;
                    }
                }

                ~ .hideable-inline-fields {
                    .${curr.key}-type-field {
                        display: inline-block;
                    }
                }
            } `
        }, '')}
    `

    const ContentWrapper = styled.div`
    `

    const FlexRow = styled.div`
        display: flex;
        justify-content: space-between;
        align-items: center;
    `

    const FieldLabel = styled.div`
        text-align: center;
        font-size: ${sizes.small};
        margin-right: 0.5rem;
    `

    const NameRow = styled.div`
        border-bottom: solid 2px ${colors.black};
        padding-bottom: 0.5rem;
    `

    const CategoryRow = styled(FlexRow)`
        input {
            font-size: ${sizes.xSmall};
            padding: 0;
            color: ${colors.darkorange};
            text-align: right;
            width: 60%;
        }

        select {
            width: 30%;
            font-size: ${sizes.xSmall};
            padding: 0;
            height: auto;
        }
    `;

    const FieldRow = styled.div`
        display: flex;
        margin-top: 1rem;
        justify-content: flex-start;
        flex-wrap: wrap;
        align-items: center;

        input {
            text-align: center;
        }
    `

    const ButtonRow = styled.div`
        button {
            margin-bottom: 0.5rem!important;
            margin-right: 0.5rem!important;
        }
    `;

    return (
        <ItemCard>
            {ItemTypeArray.map((x,i)=>{
                return (
                    <HiddenInput className={`item-type-${x.key}`} field={itemFields.type} value={x.key} key={i}></HiddenInput>
                )
            })}
            <ContentWrapper className="hideable-fields">
                <CategoryRow>
                    {isInventory && 
                        <SelectInput 
                            field={itemFields.type}
                            options={ItemTypeArray}
                            appearance={false}
                        />
                    }
                    {!isInventory && 
                        <ReadOnly field={itemFields.type}/>
                    }
                    <TextInput field={itemFields.category}/>
                </CategoryRow>
                <NameRow>
                    <TextInput field={itemFields.name} placeholder="Item Name"/>
                </NameRow>

                <MiscField>
                    <FieldLabel>Quantity</FieldLabel>
                    <NumberInput field={itemFields.quantity}/>
                </MiscField>

                <MeleeField>
                    <FieldRow >
                        <IconRow tip="Melee Attack Damage" field={itemFields.melee} src="https://tojikan.github.io/znz-roll20/assets/images/icons/pointy-sword.png"/>
                        <IconRow tip="Damage for throwing your melee weapon." field={itemFields.ranged} src="https://tojikan.github.io/znz-roll20/assets/images/icons/throwing-ball.png"/>
                        <IconRow tip="Block Multiplier" field={itemFields.block} src="https://tojikan.github.io/znz-roll20/assets/images/icons/vibrating-shield.png"/>
                        <IconRow tip="Durability: Use 1 durability for every attack/block. Item breaks if 0." field={itemFields.durability} src="https://tojikan.github.io/znz-roll20/assets/images/icons/tinker.png"/>
                    </FieldRow>
                </MeleeField>

                <RangedField>
                    <FieldRow >
                        <IconRow tip="Ranged Attack Damage" field={itemFields.ranged} src="https://tojikan.github.io/znz-roll20/assets/images/icons/striking-splinter.png"/>
                        <IconRow tip="Damage for meleeing with your ranged weapon." field={itemFields.melee} src="https://tojikan.github.io/znz-roll20/assets/images/icons/gun-stock.png"/>
                        <IconRow tip="Ammo Type" field={itemFields.ammotype} ammoselect={true} src="https://tojikan.github.io/znz-roll20/assets/images/icons/machine-gun-magazine.png"/>
                        <IconRow tip="Ammo. You use 1 ammo for every attack. Must be reloaded if 0." field={itemFields.ammo} src="https://tojikan.github.io/znz-roll20/assets/images/icons/heavy-bullets.png"/>
                        <IconRow tip="Block Multiplier" field={itemFields.block} src="https://tojikan.github.io/znz-roll20/assets/images/icons/vibrating-shield.png"/>
                        <IconRow tip="Durability. Use 1 durability for every melee/block. Item breaks if 0." field={itemFields.durability} src="https://tojikan.github.io/znz-roll20/assets/images/icons/tinker.png"/>
                    </FieldRow>
                </RangedField>

                <ThrownField>
                    <FieldRow >
                        <IconRow tip="Thrown Weapon Damage" field={itemFields.ranged} src="https://tojikan.github.io/znz-roll20/assets/images/icons/throwing-ball.png"/>
                        <IconRow tip="Quantity." field={itemFields.quantity} src="https://tojikan.github.io/znz-roll20/assets/images/icons/grenade.png"/>
                    </FieldRow>
                </ThrownField>

                <ArmorField>
                    <FieldRow >
                        <IconRow tip="Block Multiplier. " field={itemFields.block} src="https://tojikan.github.io/znz-roll20/assets/images/icons/vibrating-shield.png"/>
                        <IconRow tip="Durability: Use 1 durability for every block. Item breaks if 0." field={itemFields.durability} src="https://tojikan.github.io/znz-roll20/assets/images/icons/tinker.png"/>
                    </FieldRow>
                </ArmorField>


                <TextAreaInput field={itemFields.description} resize="vertical"/>
            </ContentWrapper>

            {(!isInventory && props.index)&&
                <ButtonRow className="hideable-fields">
                    <MeleeField>
                        <BasicRollButton value={ GenerateAttackRoll('meleeattack', props.index, 'Melee Attack', itemFields.name.key)}>Attack</BasicRollButton>
                        <BasicRollButton value={ GenerateAttackRoll('blockaction', props.index, 'Block', itemFields.name.key)}>Block</BasicRollButton> 
                        <BasicRollButton value={ GenerateAttackRoll('meleethrow', props.index, 'throw their melee weapon!', itemFields.name.key)}>Throw</BasicRollButton> 
                        <ActionButton action={`unequip_${props.index}`}>
                            Unequip
                        </ActionButton>
                    </MeleeField>
                    <RangedField>
                        <BasicRollButton value={ GenerateAttackRoll('rangedattack', props.index, 'Ranged Attack', itemFields.name.key)}>Fire</BasicRollButton>
                        <BasicRollButton value={ GenerateAttackRoll('meleeattack', props.index, 'Melee with their ranged weapon!', itemFields.name.key)}>Melee</BasicRollButton>
                        <BasicRollButton value={ GenerateAttackRoll('blockaction', props.index, 'Block', itemFields.name.key)}>Block</BasicRollButton>
                        <BasicRollButton value={GenerateReloadCommand(props.index, itemFields)}>Reload</BasicRollButton>
                        <ActionButton action={`unequip_${props.index}`}>
                            Unequip
                        </ActionButton>
                    </RangedField>
                    <ArmorField>
                        <BasicRollButton value={ GenerateAttackRoll('blockaction', props.index, 'Block', itemFields.name.key) }>Block</BasicRollButton>
                        <ActionButton action={`unequip_${props.index}`}>
                            Unequip
                        </ActionButton>
                    </ArmorField>
                    <ThrownField>
                        <BasicRollButton value={ GenerateAttackRoll('throwaction', props.index, 'Block', itemFields.name.key)}>Throw</BasicRollButton> 
                        <ActionButton action={`unequip_${props.index}`}>
                            Unequip
                        </ActionButton>
                    </ThrownField>

                </ButtonRow>
            }

            {(isInventory) && 
                <ButtonRow  className="hideable-inline-fields">
                    <EquippableField>
                        <ActionButton action='equip'>
                            Equip
                        </ActionButton>
                    </EquippableField>

                    <BasicRollButton value={`Export Item: <br/> \n \n !!pickup ${exportItem(itemFields)}`}>
                        Export
                    </BasicRollButton>

                    <ActionButton action='delete' red={true}>
                        Delete
                    </ActionButton>
                </ButtonRow>
            }

        </ItemCard>
    )
}


function exportItem(obj){
    let result = '';

    for (let key in obj){
        let fld = obj[key];

        if ('key' in fld){
            let key = fld.key;
            result += ` ${key}='@{${key}}' `;
        }
    }

    return result;
}


function IconRow( props ){

    const Row = styled.div`
        display: flex;
        margin-bottom: 1rem;
        min-width: 8rem;
        flex: 1 1 50%;

        input {
            width: 3rem!important;
        }

        select {
            padding: 0;
            font-size: 1rem;
            text-align: center;
            width: auto;
            margin-left: 0.5rem;
        }
    `

    const IconImage = styled.img`
        width: 2.4rem;
        height: 2.4rem;
        min-width: 2rem;
    `
    if (props.ammoselect){
        return (
            <Row>
                <ToolTip text={props.tip}><IconImage src={props.src}/></ToolTip>
                <SelectInput field={props.field} options={objToArray(CharacterModel.ammo.list)}/>
            </Row>
        )
    }

    return (
        <Row>
            <ToolTip text={props.tip}><IconImage src={props.src}/></ToolTip>
            <NumberInput field={props.field}/>
            {props.field.max &&
                <DividerLine/>
            }
            {props.field.max &&
                <NumberInput field={props.field} max={true}/>
            }
        </Row>
    )
}


function EquippableField( props ){
    const Equippable = styled.span`
        display: none;
    `

    return (
        <Equippable className={`${ItemTypes.melee.key}-type-field ${ItemTypes.ranged.key}-type-field ${ItemTypes.armor.key}-type-field ${ItemTypes.thrown.key}-type-field
        `}>
            {props.children}
        </Equippable> 
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

function ThrownField( props ){
    return (
        <Hideablefield className={`${ItemTypes.thrown.key}-type-field`}>
            {props.children}
        </Hideablefield>
    )
}


function MiscField( props ){
    const MiscRow = styled.div`
        display: flex;
        justify-content: center;
        margin: 1rem 0;
        align-items: center;
    `

    return (
        <Hideablefield className={`${ItemTypes.misc.key}-type-field`}>
            <MiscRow>
                {props.children}    
            </MiscRow>
        </Hideablefield>
    )
}

