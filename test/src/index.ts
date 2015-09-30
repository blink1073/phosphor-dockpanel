/*-----------------------------------------------------------------------------
| Copyright (c) 2014-2015, PhosphorJS Contributors
|
| Distributed under the terms of the BSD 3-Clause License.
|
| The full license is in the file LICENSE, distributed with this software.
|----------------------------------------------------------------------------*/
'use strict';

import expect = require('expect.js');

import {
  BoxPanel
} from 'phosphor-boxpanel';

import {
  Message, postMessage, sendMessage
} from 'phosphor-messaging';

import {
  Property
} from 'phosphor-properties';

import {
  SplitPanel
} from 'phosphor-splitpanel';

import {
  StackedPanel
} from 'phosphor-stackedpanel';

import {
  Tab, TabBar
} from 'phosphor-tabs';

import {
  attachWidget, detachWidget, ResizeMessage, Widget
} from 'phosphor-widget';

import {
  DOCK_PANEL_CLASS, DOCK_SPLIT_PANEL_CLASS, DOCK_TAB_PANEL_CLASS, 
  DOCKING_CLASS, OVERLAY_CLASS, DockMode, DockPanel
} from '../../lib/index';

import './index.css';


class LogPanel extends DockPanel {

  static messages: string[] = [];

  processMessage(msg: Message): void {
    super.processMessage(msg);
    LogPanel.messages.push(msg.type);
  }

  handleEvent(event: Event): void {
    super.handleEvent(event);
    LogPanel.messages.push(event.type);
  }

}


class LogWidget extends Widget {

  messages: string[] = [];

  processMessage(msg: Message): void {
    super.processMessage(msg);
    this.messages.push(msg.type);
  }
}


function triggerMouseEvent (node: HTMLElement, eventType: string, options: any={}) {
  options.bubbles = true;
  var clickEvent = new MouseEvent(eventType, options);
  node.dispatchEvent(clickEvent);
}


describe('phosphor-dockpanel', () => {


  describe('DOCK_PANEL_CLASS', () => {

    it('should equal `p-DockPanel`', () => {
      expect(DOCK_PANEL_CLASS).to.be('p-DockPanel');
    });

  });

  describe('DOCK_SPLIT_PANEL_CLASS', () => {

    it('should equal `p-DockSplitPanel`', () => {
      expect(DOCK_SPLIT_PANEL_CLASS).to.be('p-DockSplitPanel');
    });

  });

  describe('DOCK_TAB_PANEL_CLASS', () => {

    it('should equal `p-DockTabPanel`', () => {
      expect(DOCK_TAB_PANEL_CLASS).to.be('p-DockTabPanel');
    });

  });

  describe('OVERLAY_CLASS', () => {

    it('should equal `p-DockTabPanel-overlay`', () => {
      expect(OVERLAY_CLASS).to.be('p-DockTabPanel-overlay');
    });

  });

  describe('DOCKING_CLASS', () => {

    it('should equal `p-mod-docking`', () => {
      expect(DOCKING_CLASS).to.be('p-mod-docking');
    });

  });

  describe('DockPanel', () => {

    describe('.SplitTop', () => {

      it('should be an alias of the `SplitTop` DockMode', () => {
          expect(DockPanel.SplitTop).to.be(DockMode.SplitTop);
      });

    });

    describe('.SplitLeft', () => {

      it('should be an alias of the `SplitLeft` DockMode', () => {
          expect(DockPanel.SplitLeft).to.be(DockMode.SplitLeft);
      });

    });

    describe('.SplitRight', () => {

      it('should be an alias of the `SplitRight` DockMode', () => {
          expect(DockPanel.SplitRight).to.be(DockMode.SplitRight);
      });

    });

    describe('.SplitBottom', () => {

      it('should be an alias of the `SplitBottom` DockMode', () => {
          expect(DockPanel.SplitBottom).to.be(DockMode.SplitBottom);
      });

    });

    describe('.TabBefore', () => {

      it('should be an alias of the `TabBefore` DockMode', () => {
          expect(DockPanel.TabBefore).to.be(DockMode.TabBefore);
      });

    });

    describe('.TabAfter', () => {

      it('should be an alias of the `TabAfter` DockMode', () => {
          expect(DockPanel.TabAfter).to.be(DockMode.TabAfter);
      });

    });

    describe('.tabProperty', () => {

      it('should be a property descriptor', () => {
        expect(DockPanel.tabProperty instanceof Property).to.be(true);
      });

      it('should default to `null`', () => {
        var panel = new DockPanel();
        expect(DockPanel.tabProperty.get(panel)).to.be(null);
      });

    });

    describe('.handleSizeProperty', () => {

      it('should be a property descriptor', () => {
        expect(DockPanel.handleSizeProperty instanceof Property).to.be(true);
      });

      it('should default to `3`', () => {
        var panel = new DockPanel();
        expect(DockPanel.handleSizeProperty.get(panel)).to.be(3);
      });

      it('should post `layout-request`', (done) => {
        LogPanel.messages = [];
        var panel = new LogPanel();
        attachWidget(panel, document.body);
        DockPanel.handleSizeProperty.set(panel, 5);
        requestAnimationFrame(() => {
          expect(LogPanel.messages.indexOf('layout-request')).to.not.be(-1);
          done();
        });
      });

    });

    describe('.getTab', () => {

      it('should return the dock panel tab for the given widget', () => {
        var widget = new Widget();
        expect(DockPanel.getTab(widget)).to.be(null);
      });

      it('should be a pure delegate to tabProperty', () => {
        var widget = new Widget();
        var tab = new Tab();
        DockPanel.tabProperty.set(widget, tab);
        expect(DockPanel.getTab(widget)).to.eql(tab);
      });

    });

    describe('.setTab', () => {

      it('should set the dock panel tab for the given widget', () => {
        var widget = new Widget();
        var tab = new Tab();
        DockPanel.setTab(widget, tab);
        expect(DockPanel.getTab(widget)).to.eql(tab);
      });

      it('should be a pure delegate to tabProperty', () => {
        var widget = new Widget();
        var tab = new Tab();
        DockPanel.setTab(widget, tab);
        expect(DockPanel.tabProperty.get(widget)).to.be(tab);
      });

    });

    describe('#constructor()', () => {

      it('should accept no arguments', () => {
        var panel = new DockPanel();
        expect(panel instanceof DockPanel).to.be(true);
      });

      it('should add `DOCK_PANEL_CLASS`', () => {
        var panel = new DockPanel();
        expect(panel.hasClass(DOCK_PANEL_CLASS)).to.be(true);
      });

      it('should add a split panel child', () => {
        var panel = new DockPanel();
        expect(panel.children[0] instanceof SplitPanel).to.be(true);
      });

    });

    describe('#dispose()', () => {

      it('should dispose of the resources held by the panel', () => {
        var panel = new DockPanel();
        panel.dispose();
        expect(panel.isDisposed).to.be(true);
        expect(panel.children.length).to.be(0);
      });

    });

    describe('#handleSize', () => {

      it('should get the handle size of the dock split panels', () => {
        var panel = new DockPanel();
        expect(panel.handleSize).to.be(3);
      });

      it('should set the handle size of the dock split panels', () => {
        var panel = new DockPanel();
        panel.handleSize = 4;
        expect(panel.handleSize).to.be(4);
      });

      it('should a pure delegate to the handleSizeProperty', () => {
        var panel = new DockPanel();
        DockPanel.handleSizeProperty.set(panel, 5);
        expect(panel.handleSize).to.be(5);
        panel.handleSize = 4;
        expect(DockPanel.handleSizeProperty.get(panel)).to.be(4);
      });

    });

    describe('#addWidget()', () => {

      it('should add a panel to the root', () => {
        var widget = new Widget();
        DockPanel.setTab(widget, new Tab());
        var panel = new DockPanel();
        panel.addWidget(widget);
        expect(widget.parent instanceof StackedPanel).to.be(true);
      });

      it('should throw an error if the tab property is not set', () => {
        var widget = new Widget();
        var panel = new DockPanel();
        expect(() => panel.addWidget(widget)).to.throwError();
      });

      it('should insert relative to root if no ref', () => {
        var widget = new Widget();
        DockPanel.setTab(widget, new Tab());
        var panel = new DockPanel();
        panel.addWidget(widget, DockMode.SplitTop);
        expect(widget.parent instanceof StackedPanel).to.be(true);
      });

      it('should insert relative to root if ref is not in dock', () => {
        var widget0 = new Widget();
        var widget1 = new Widget();
        DockPanel.setTab(widget0, new Tab());
        var panel = new DockPanel();
        panel.addWidget(widget0, DockMode.TabAfter, widget1);
        expect(widget0.parent instanceof StackedPanel).to.be(true);
      });

      it('should move to a new location if already in the panel', () => {
        var widget0 = new Widget();
        var widget1 = new Widget();
        DockPanel.setTab(widget0, new Tab());
        DockPanel.setTab(widget1, new Tab());
        var panel = new DockPanel();
        panel.addWidget(widget0);
        panel.addWidget(widget1, DockMode.TabBefore, widget0);
        panel.addWidget(widget0, DockMode.SplitLeft, widget1);
        expect(widget0.parent instanceof StackedPanel).to.be(true);
      });

      it('should throw an error if the widget and the ref are the same', () => {
        var widget = new Widget();
        DockPanel.setTab(widget, new Tab());
        var panel = new DockPanel();
        var badAdd = () => {
          panel.addWidget(widget, DockMode.SplitBottom, widget);
        }
        expect(badAdd).to.throwError();
      });

    });

    describe('#handleEvent()', () => {

      it('should be invoked during a handle grab and move', (done) => {
        LogPanel.messages = [];
        var widget0 = createContent('foo');
        var widget1 = createContent('bar');
        var panel = new LogPanel();
        panel.id = 'main';
        panel.addWidget(widget0);
        panel.addWidget(widget1, DockPanel.TabAfter, widget0);
        attachWidget(panel, document.body);
        requestAnimationFrame(() => {
          var tab0 = DockPanel.getTab(widget0);
          var rect = tab0.node.getBoundingClientRect();
          triggerMouseEvent(tab0.node, 'mousedown', 
                            { clientX: rect.left, 
                              clientY: rect.top });
          triggerMouseEvent(tab0.node, 'mousemove', 
                            { clientX: rect.left + 200, 
                              clientY: rect.top + 200 });
          triggerMouseEvent(tab0.node, 'mousemove', 
                            { clientX: rect.left + 200, 
                              clientY: rect.top });
          triggerMouseEvent(tab0.node, 'contextmenu', 
                            { clientX: rect.left + 200, 
                              clientY: rect.top });
          triggerMouseEvent(tab0.node, 'mouseup', 
                            { clientX: rect.left + 200, 
                              clientY: rect.top });
          expect(LogPanel.messages.indexOf('mousemove')).to.not.be(-1);
          expect(LogPanel.messages.indexOf('contextmenu')).to.not.be(-1);
          expect(LogPanel.messages.indexOf('mouseup')).to.not.be(-1);
          done();
        });
      });

    });

    describe('example', () => {

      it('should excercise the full API', (done) => {
        var r1 = createContent('Red');
        var r2 = createContent('Red');
        var r3 = createContent('Red');

        var b1 = createContent('Blue');
        var b2 = createContent('Blue');
        var b3 = createContent('Blue');

        var g1 = createContent('Green');
        var g2 = createContent('Green');
        var g3 = createContent('Green');

        var y1 = createContent('Yellow');
        var y2 = createContent('Yellow');
        var y3 = createContent('Yellow');

        LogPanel.messages = [];
        var panel = new LogPanel();

        panel.addWidget(r1);

        panel.addWidget(b1, DockPanel.SplitRight, r1);
        panel.addWidget(y1, DockPanel.SplitBottom, b1);
        panel.addWidget(g1, DockPanel.SplitLeft, y1);

        panel.addWidget(b2, DockPanel.SplitBottom);

        panel.addWidget(y2, DockPanel.TabBefore, r1);
        panel.addWidget(b3, DockPanel.TabBefore, y2);
        panel.addWidget(g2, DockPanel.TabBefore, b2);
        panel.addWidget(y3, DockPanel.TabBefore, g2);
        panel.addWidget(g3, DockPanel.TabBefore, y3);
        panel.addWidget(r2, DockPanel.TabBefore, b1);
        panel.addWidget(r3, DockPanel.TabBefore, y1);

        var parent = new Widget();
        parent.children = [panel];

        attachWidget(parent, document.body);

        expect(LogPanel.messages.indexOf('child-added')).to.not.be(-1);
        expect(LogPanel.messages.indexOf('after-attach')).to.not.be(-1);
        requestAnimationFrame(() => {
          expect(LogPanel.messages.indexOf('layout-request')).to.not.be(-1);
          done();
        });
      });

   });

  });

});


function createContent(title: string): Widget {
  var widget = new Widget();
  widget.addClass('content');

  var tab = new Tab(title);
  tab.closable = true;
  DockPanel.setTab(widget, tab);

  return widget;
}
