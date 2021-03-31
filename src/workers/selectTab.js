(function(){
    const sheetTabButtons = [
        "selectTabStats",
        "selectTabAbilities",
        "selectTabInventory",
        "selectTabNotes",
        "selectTabEquipment"
    ];

    sheetTabButtons.forEach(button => {
        on(`clicked:${button}`, function(){
            setAttrs({
                sheet_tab:button
            })
        });
    });
})();