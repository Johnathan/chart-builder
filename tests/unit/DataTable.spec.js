import {shallowMount} from '@vue/test-utils';
import DataTable from '@/components/DataTable.vue';

describe('DataTable.vue', () => {
    it('can accept data', () => {
        const wrapper = shallowMount(DataTable, {
            propsData: {
                value: [
                    [null, null, null, null, null],
                    [null, null, null, null, null],
                    [null, null, null, null, null],
                    [null, null, null, null, null],
                    [null, null, null, null, null],
                ],
            },
        });

        expect(wrapper.isVueInstance()).toBe(true);
        expect(wrapper.vm.internalRows.length).toBe(5);
        expect(wrapper.vm.internalRows[0].length).toBe(5);
    });

    it('can add a row', () => {
        const wrapper = shallowMount(DataTable);
        wrapper.vm.addRow();

        expect(wrapper.vm.internalRows.length).toBe(4);
    });

    it('can add a column', () => {
        const wrapper = shallowMount(DataTable);
        wrapper.vm.addColumn();

        expect(wrapper.vm.internalRows[0].length).toBe(4);
    });

    it('can add a row at a specific index', () => {
        const wrapper = shallowMount(DataTable, {
            propsData: {
                value: [
                    ['one', 'one', 'one'],
                    ['two', 'two', 'two'],
                    ['three', 'three', 'three'],
                ]
            }
        });

        wrapper.vm.addRow(1);

        expect(wrapper.vm.internalRows[0]).toEqual(['one', 'one', 'one']);
        expect(wrapper.vm.internalRows[1]).toEqual([null, null, null]);
        expect(wrapper.vm.internalRows[2]).toEqual(['two', 'two', 'two']);
    });

    it('can add a column at a specific index', () => {
        const wrapper = shallowMount(DataTable, {
            propsData: {
                value: [
                    ['one', 'two', 'three'],
                    ['one', 'two', 'three'],
                    ['one', 'two', 'three'],
                ]
            }
        });

        wrapper.vm.addColumn(1);

        expect(wrapper.vm.internalRows[0]).toEqual(['one', null, 'two', 'three']);
        expect(wrapper.vm.internalRows[2]).toEqual(['one', null, 'two', 'three']);
    });
});
