const sheetTabButtons = [
    "selectTabStats",
    "selectTabAbilities",
    "selectTabEquipment",
    "selectTabNotes"
];

sheetTabButtons.forEach(button => {
    on(`clicked:${button}`, function(){
        setAttrs({
            sheet_tab:button
        })
    });
});